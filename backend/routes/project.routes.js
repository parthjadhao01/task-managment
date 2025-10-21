import express from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import memberModel from "../models/member.model.js";
import projectModel from "../models/project.model.js";

const router = express.Router();

router.get("/get-projects/:workspaceId", authProtect, async (req, res) => {
    try {
        const { workspaceId } = req.params
        if (!workspaceId) {
            return res.status(400).send("Missing Workspace ID")
        }
        const memeber = await memberModel.find({workspaceId,userId : req.user._id})
        if (!memeber) {
            return res.status(401).send("Unauthrorized")
        }

        const projects = await projectModel.find({workspaceId})
        return res.status(200).send(projects)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
})

router.get("/get-project/:projectId", authProtect, async (req, res) =>{
    try {
        const {projectId} = req.params
        if (!projectId) {
            return res.status(400).send("Missing Project ID")
        }
        const project = await projectModel.findById(projectId)
        if (!project) {
            return res.status(404).send("Project not found")
        }
        const memeber = await memberModel.find({workspaceId : project.workspaceId,userId : req.user._id})
        if (!memeber) {
            return res.status(401).send("Unauthroize")
        }
        return res.status(200).send(project)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
})

router.post("/create-project/:workspaceId", authProtect, async(req,res)=>{
    try {
        const {name} = req.body
        const {workspaceId} = req.params
        if (!name || !workspaceId) {
            return res.status(400).send("Missing required fields")
        }

        const member = await memberModel.find({workspaceId : workspaceId, userId : req.user._id})
        if (!member) {
            return res.status(401).send("Unauthrorized")
        }

        const project = await new projectModel({name,workspaceId,userId : req.user._id})
        await project.save()
        return res.status(200).send(project)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
})

// Todo : Create udpate project route

// Todo : Create delete project route

export default router