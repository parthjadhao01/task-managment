"use client";
import React from 'react';
import usePermissions from '@/hooks/usePermissions';
import { Loader } from 'lucide-react';

interface PermissionGuardProps {
    resource: string;
    action: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showLoading?: boolean;
}

/**
 * PermissionGuard component - Shows children only if user has permission
 * 
 * @example
 * <PermissionGuard resource="tasks" action="create">
 *   <Button>Create Task</Button>
 * </PermissionGuard>
 */
export default function PermissionGuard({
    resource,
    action,
    children,
    fallback = null,
    showLoading = false
}: PermissionGuardProps) {
    const { hasPermission, loading } = usePermissions();

    if (loading && showLoading) {
        return (
            <div className="flex items-center justify-center p-2">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (loading) return null;

    const permitted = hasPermission(resource, action);

    if (!permitted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Hook version for conditional rendering in components
 */
export function usePermissionGuard(resource: string, action: string) {
    const { hasPermission, loading } = usePermissions();
    
    return {
        permitted: hasPermission(resource, action),
        loading
    };
}