import express from "express"
import { authProtect } from "../middleware/auth.middleware.js"
import userModel from "../models/user.model.js"
import workspaceModel from "../models/workspace.model.js"

const router = express.Router()

router.post("/create-workspace", authProtect, (req, res) => {
    try {
        const { name } = req.body
        const userId = req.user._id
        const user = userModel.findById(userId)
        if (user) {
            // Todo : In future update workspaced Ids in user table also
            const newWorkspace = new workspaceModel({ name, userId })
            newWorkspace.save();
            res.status(201).send({ message: "Workspace created succesfully", workspace: newWorkspace })
        } else {
            res.status(400).send({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).send({message : "Internal Server Error ", error : error})
        console.log(error)
    }
})

export default router