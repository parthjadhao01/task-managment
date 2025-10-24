import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    resource: {
        type: String,
        enum: ["tasks", "projects", "workspaces", "members", "settings"],
        required: true
    },
    actions: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    },
    conditions: {
        own: { type: Boolean, default: false }, // Can only modify own resources
        assigned: { type: Boolean, default: false }, // Can only modify assigned resources
        status: [{
            type: String,
            enum: ["Backlog", "Todo", "Doing", "Done"]
        }] // Allowed statuses to modify
    }
});

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    permissions: [permissionSchema],
    isSystemRole: {
        type: Boolean,
        default: false // System roles like "admin", "member" cannot be deleted
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Role", roleSchema);