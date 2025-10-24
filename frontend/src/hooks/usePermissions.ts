"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useWorkspaceId from "./useWorkSpaceId";

interface Permission {
    resource: string;
    actions: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
    conditions: {
        own: boolean;
        assigned: boolean;
        status: string[];
    };
}

interface UserRole {
    _id: string;
    name: string;
    permissions: Permission[];
    isAdmin: boolean;
}

export default function usePermissions() {
    const workspaceId = useWorkspaceId();
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchUserRole = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token || !workspaceId) {
                setUserRole(null);
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // Get user's member record to check role
            const response = await axios.get(
                `http://localhost:8000/member/get-members/${workspaceId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const userProfile = await axios.get(
                "http://localhost:8000/auth/profile",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const currentUserId = userProfile.data._id;
            const currentMember = response.data.find(
                (m: any) => m.userId._id === currentUserId
            );

            if (currentMember) {
                if (currentMember.role === "admin") {
                    setIsAdmin(true);
                    setUserRole({
                        _id: "admin",
                        name: "Admin",
                        permissions: [],
                        isAdmin: true
                    });
                } else if (currentMember.roleId) {
                    const roleResponse = await axios.get(
                        `http://localhost:8000/role/get-role/${currentMember.roleId._id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setUserRole({
                        ...roleResponse.data,
                        isAdmin: false
                    });
                    setIsAdmin(false);
                }
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        fetchUserRole();
    }, [fetchUserRole]);

    const hasPermission = (resource: string, action: string): boolean => {
        // Admins have all permissions
        if (isAdmin) return true;

        // No role assigned
        if (!userRole) return false;

        // Find permission for resource
        const permission = userRole.permissions.find(
            (p) => p.resource === resource
        );

        if (!permission) return false;

        // Check if action is allowed
        return permission.actions[action as keyof typeof permission.actions] || false;
    };

    const canModifyStatus = (resource: string, status: string): boolean => {
        // Admins can modify any status
        if (isAdmin) return true;

        // No role assigned
        if (!userRole) return false;

        // Find permission for resource
        const permission = userRole.permissions.find(
            (p) => p.resource === resource
        );

        if (!permission) return false;

        // If no status restrictions, allow all
        if (!permission.conditions.status || permission.conditions.status.length === 0) {
            return true;
        }

        // Check if status is allowed
        return permission.conditions.status.includes(status);
    };

    const needsOwnership = (resource: string): boolean => {
        if (isAdmin) return false;
        if (!userRole) return false;

        const permission = userRole.permissions.find(
            (p) => p.resource === resource
        );

        return permission?.conditions.own || false;
    };

    const needsAssignment = (resource: string): boolean => {
        if (isAdmin) return false;
        if (!userRole) return false;

        const permission = userRole.permissions.find(
            (p) => p.resource === resource
        );

        return permission?.conditions.assigned || false;
    };

    return {
        userRole,
        loading,
        isAdmin,
        hasPermission,
        canModifyStatus,
        needsOwnership,
        needsAssignment,
        refreshRole: fetchUserRole
    };
}