"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Shield, Trash2, Users } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import EditRoleModal from './edit-role-modal';

interface Role {
    _id: string;
    name: string;
    description: string;
    permissions: Array<{
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
    }>;
    isSystemRole: boolean;
}

interface RoleCardProps {
    role: Role;
    onDelete: (roleId: string) => void;
    onRefresh: () => void;
}

export default function RoleCard({ role, onDelete, onRefresh }: RoleCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const permissionCount = role.permissions.length;
    const totalActions = role.permissions.reduce((sum, perm) => {
        return sum + Object.values(perm.actions).filter(Boolean).length;
    }, 0);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            onDelete(role._id);
        }
    };

    return (
        <>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="size-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg">{role.name}</CardTitle>
                                {role.isSystemRole && (
                                    <Badge variant="secondary" className="mt-1">
                                        System Role
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {!role.isSystemRole && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                        <Edit className="size-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <CardDescription className="mt-2">
                        {role.description || 'No description provided'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Resources</span>
                            <Badge variant="outline">{permissionCount}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Permissions</span>
                            <Badge variant="outline">{totalActions}</Badge>
                        </div>
                        
                        {role.permissions.length > 0 && (
                            <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-2">Resources:</p>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map((perm, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {perm.resource}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <EditRoleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={onRefresh}
                role={role}
            />
        </>
    );
}