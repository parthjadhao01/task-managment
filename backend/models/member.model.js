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
        enum: ["admin", "member"],
        default: "member"
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: false // Only required for non-admin members
    }
}, {
    timestamps: true
});

export default mongoose.model("Member", memberSchema);