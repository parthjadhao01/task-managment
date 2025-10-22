import express from "express"
import { authProtect } from "../middleware/auth.middleware.js"
import userModel from "../models/user.model.js"
import workspaceModel from "../models/workspace.model.js"
import memberModel from "../models/member.model.js"

const router = express.Router()

/**
 * @swagger
 * /workspace/create-workspace:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspace]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: My New Workspace
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/create-workspace", authProtect, (req, res) => {
    try {
        const { name } = req.body
        const userId = req.user._id
        const user = userModel.findById(userId)
        if (user) {
            // Todo : In future update workspaced Ids in user table also
            const newWorkspace = new workspaceModel({ name, userId })
            newWorkspace.save();
            const newMember = new memberModel({ userId, workspaceId : newWorkspace._id, role : "admin"})
            newMember.save()
            res.status(201).send({ message: "Workspace created succesfully", workspace: newWorkspace })
        } else {
            res.status(400).send({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).send({message : "Internal Server Error ", error : error})
        console.log(error)
    }
})

/**
 * @swagger
 * /workspace/get-workspaces:
 *   get:
 *     summary: Get all workspaces for the current user
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: No workspaces found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/get-workspaces", authProtect, async (req, res) => {
    try {
        const userId = req.user._id
        const user = await userModel.findById(userId)
        if (user) {
            const workspaces = await workspaceModel.find({userId})
            if (!workspaces) {
                res.status(400).send("No workspaces found")
            }
            res.status(200).send(workspaces)
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log("Intenal Server Error : ",error)
    }
})


export default router