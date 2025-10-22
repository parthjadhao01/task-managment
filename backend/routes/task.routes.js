import express from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import memberModel from "../models/member.model.js";
import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";

const router = express.Router();

/**
 * @swagger
 * /task/create-task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workspaceId
 *               - projectId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Design homepage
 *               status:
 *                 type: string
 *                 enum: [Backlog, Todo, Doing, Done]
 *                 example: Todo
 *               workspaceId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               assignedId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *     responses:
 *       200:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/create-task",authProtect,async (req,res)=>{
    try {
        const {name,status,workspaceId,projectId,assignedId,dueDate} = req.body
        const memeber = await memberModel.find({workspaceId,userId : req.user._id})
        if (!memeber){
            return res.status(401).send("Unauthorized")
        }
        const newTask = new taskModel({name,status,workspaceId,projectId,assignedId,dueDate})
        await newTask.save()
        return res.status(200).send(newTask)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
})

/**
 * @swagger
 * /task/get-tasks:
 *   post:
 *     summary: Get tasks with filters
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               projectId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 enum: [Backlog, Todo, Doing, Done]
 *                 example: Todo
 *               search:
 *                 type: string
 *                 example: design
 *               assignedId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/get-tasks", authProtect, async (req, res) => {
  try {
    const { workspaceId, projectId, status, search, assignedId, dueDate } = req.body;

    // 1️⃣ Check if user is a valid member of the workspace
    const member = await memberModel.findOne({
      workspaceId,
      userId: req.user._id,
    });

    if (!member) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Build a dynamic filter object for MongoDB
    const filter = { workspaceId };

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (assignedId) filter.assignedId = assignedId;
    if (dueDate) filter.dueDate = dueDate;

    // 3️⃣ Base query
    let query = taskModel.find(filter);

    // 4️⃣ Add search condition if provided
    if (search) {
      query = query.find({ name: { $regex: search, $options: "i" } }); // case-insensitive
    }

    // 5️⃣ Populate related data
    const tasks = await query
      .populate("projectId", "name description")     // Only select name & description
      .populate("workspaceId", "name")               // Only select workspace name
      .populate("assignedId", "name email avatar")   // Select user fields
      .exec();

    // 6️⃣ Return populated data
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
