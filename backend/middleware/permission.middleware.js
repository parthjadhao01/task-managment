import memberModel from "../models/member.model.js";
import roleModel from "../models/role.model.js";

/**
 * Check if user has permission for a specific action on a resource
 * @param {string} resource - The resource type (tasks, projects, etc.)
 * @param {string} action - The action to perform (create, read, update, delete)
 * @param {object} options - Additional options for permission checking
 */
export const checkPermission = (resource, action, options = {}) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const workspaceId = req.params.workspaceId || req.body.workspaceId;

            if (!workspaceId) {
                return res.status(400).json({ message: "Workspace ID required" });
            }

            // Find member record
            const member = await memberModel.findOne({ userId, workspaceId })
                .populate('roleId');

            if (!member) {
                return res.status(403).json({ message: "Not a member of this workspace" });
            }

            // Admin role has all permissions
            if (member.role === "admin") {
                return next();
            }

            // Get role permissions
            const role = member.roleId;
            if (!role) {
                return res.status(403).json({ message: "No role assigned" });
            }

            // Find permission for this resource
            const permission = role.permissions.find(p => p.resource === resource);
            
            if (!permission) {
                return res.status(403).json({ 
                    message: `No permissions for ${resource}` 
                });
            }

            // Check if action is allowed
            if (!permission.actions[action]) {
                return res.status(403).json({ 
                    message: `Not allowed to ${action} ${resource}` 
                });
            }

            // Check conditional permissions
            if (options.checkOwnership && permission.conditions.own) {
                const resourceDoc = await options.model.findById(req.params.id || req.body.id);
                if (resourceDoc && resourceDoc.userId.toString() !== userId.toString()) {
                    return res.status(403).json({ 
                        message: "You can only modify your own resources" 
                    });
                }
            }

            if (options.checkAssignment && permission.conditions.assigned) {
                const resourceDoc = await options.model.findById(req.params.id || req.body.id);
                if (resourceDoc && resourceDoc.assignedId.toString() !== userId.toString()) {
                    return res.status(403).json({ 
                        message: "You can only modify assigned resources" 
                    });
                }
            }

            if (options.checkStatus && permission.conditions.status.length > 0) {
                const status = req.body.status;
                if (status && !permission.conditions.status.includes(status)) {
                    return res.status(403).json({ 
                        message: `You cannot modify tasks with status: ${status}` 
                    });
                }
            }

            // Attach role info to request for further use
            req.userRole = role;
            req.userPermissions = permission;
            
            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({ message: "Permission check failed" });
        }
    };
};

/**
 * Check if user is admin of workspace
 */
export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const workspaceId = req.params.workspaceId || req.body.workspaceId;

        const member = await memberModel.findOne({ userId, workspaceId });
        
        if (!member || member.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error);
        return res.status(500).json({ message: "Authorization failed" });
    }
};

/**
 * Filter query results based on user permissions
 */
export const applyPermissionFilters = async (query, userId, workspaceId, resource) => {
    const member = await memberModel.findOne({ userId, workspaceId })
        .populate('roleId');

    if (!member || member.role === "admin") {
        return query; // Admins see everything
    }

    const role = member.roleId;
    if (!role) return query;

    const permission = role.permissions.find(p => p.resource === resource);
    if (!permission) return query;

    // Apply filters based on conditions
    if (permission.conditions.own) {
        query = query.where('userId').equals(userId);
    }

    if (permission.conditions.assigned) {
        query = query.where('assignedId').equals(userId);
    }

    if (permission.conditions.status && permission.conditions.status.length > 0) {
        query = query.where('status').in(permission.conditions.status);
    }

    return query;
};