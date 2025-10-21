import express from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import memberModel from "../models/member.model.js";

const router = express.Router();

router.post("/create-member",(req,res)=>{
    // todo create a member
    res.status(200).send("Member created")
})

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