import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "member"], // only these are allowed
        default: "user"
    },
})

export default mongoose.model("Member",memberSchema)