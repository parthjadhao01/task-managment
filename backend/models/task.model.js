import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        require: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        require: true
    },
    assignedId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    dueDate: {
        type: Date,
        require: true
    },
    description : {
        type : String
    },
    status: {
        type: String,
        enum: ["Backlog", "Todo", "Doing", "Done"],
        require: true
    },
},
    {
        timestamps: true
    })

export default mongoose.model("Task", taskSchema)