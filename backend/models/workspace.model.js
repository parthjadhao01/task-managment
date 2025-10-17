// name : string required true
// userId : string id of user model required true
// 

import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        require : true
    }
})

export default mongoose.model("Workspace",workspaceSchema)