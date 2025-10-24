import express from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/permission.middleware.js";
import roleModel from "../models/role.model.js";

const router = express.Router();

/**
 * @swagger
 * /role/create-role:
 *   post:
 *     summary: Create a new role (Admin only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               permissions:
 *                 type: array
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post("/create-role", authProtect, isAdmin, async (req, res) => {
    try {
        const { name, description, workspaceId, permissions } = req.body;
        
        if (!name || !workspaceId) {
            return res.status(400).json({ message: "Name and workspaceId required" });
        }

        // Check if role name already exists in workspace
        const existingRole = await roleModel.findOne({ name, workspaceId });
        if (existingRole) {
            return res.status(400).json({ message: "Role name already exists" });
        }

        const newRole = new roleModel({
            name,
            description,
            workspaceId,
            permissions: permissions || [],
            createdBy: req.user._id
        });

        await newRole.save();
        return res.status(201).json(newRole);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create role" });
    }
});

/**
 * @swagger
 * /role/get-roles/{workspaceId}:
 *   get:
 *     summary: Get all roles in workspace
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 */
router.get("/get-roles/:workspaceId", authProtect, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        
        const roles = await roleModel.find({ workspaceId })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        return res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch roles" });
    }
});

/**
 * @swagger
 * /role/get-role/{roleId}:
 *   get:
 *     summary: Get specific role details
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 */
router.get("/get-role/:roleId", authProtect, async (req, res) => {
    try {
        const { roleId } = req.params;
        
        const role = await roleModel.findById(roleId)
            .populate('createdBy', 'username email');

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        return res.status(200).json(role);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch role" });
    }
});

/**
 * @swagger
 * /role/update-role/{roleId}:
 *   patch:
 *     summary: Update role (Admin only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/update-role/:roleId", authProtect, isAdmin, async (req, res) => {
    try {
        const { roleId } = req.params;
        const { name, description, permissions } = req.body;

        const role = await roleModel.findById(roleId);
        
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if (role.isSystemRole) {
            return res.status(403).json({ message: "Cannot modify system roles" });
        }

        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        if (permissions) role.permissions = permissions;

        await role.save();
        return res.status(200).json(role);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update role" });
    }
});

/**
 * @swagger
 * /role/delete-role/{roleId}:
 *   delete:
 *     summary: Delete role (Admin only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/delete-role/:roleId", authProtect, isAdmin, async (req, res) => {
    try {
        const { roleId } = req.params;

        const role = await roleModel.findById(roleId);
        
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if (role.isSystemRole) {
            return res.status(403).json({ message: "Cannot delete system roles" });
        }

        await roleModel.findByIdAndDelete(roleId);
        return res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete role" });
    }
});

/**
 * @swagger
 * /role/assign-role:
 *   post:
 *     summary: Assign role to member (Admin only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 */
router.post("/assign-role", authProtect, isAdmin, async (req, res) => {
    try {
        const { memberId, roleId } = req.body;

        if (!memberId || !roleId) {
            return res.status(400).json({ message: "memberId and roleId required" });
        }

        const memberModel = (await import("../models/member.model.js")).default;
        const member = await memberModel.findById(memberId);
        
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        member.roleId = roleId;
        await member.save();

        return res.status(200).json({ message: "Role assigned successfully", member });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to assign role" });
    }
});

export default router;