import express from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import memberModel from "../models/member.model.js";

const router = express.Router();

router.post("/create-member",(req,res)=>{
    // todo create a member
    res.status(200).send("Member created")
})

/**
 * @swagger
 * /member/get-members/{workspaceId}:
 *   get:
 *     summary: Get all members in a workspace
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       400:
 *         description: Missing WorkspaceId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No members found
 *       500:
 *         description: Internal server error
 */
router.get("/get-members/:workspaceId",authProtect,async(req,res)=>{
    try {
        const {workspaceId} = req.params
        if (!workspaceId) {
            return res.status(400).send("Missing WorkspaceId")
        }
        const members = await memberModel.find({workspaceId}).populate("userId")
        if (!members) {
            return res.status(404).send("No members found")
        }
        return res.status(200).send(members)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
})

export default router;