import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    workspaceId : {
        type : Schema.Types.ObjectId,
        ref : "Workspace",
        require : true    
    },
    name : {
        type : String,
        require : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
})

export default mongoose.model("Project",projectSchema)