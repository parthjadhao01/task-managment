"use client";
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

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
}

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: Role;
}

const RESOURCES = [
    { value: 'tasks', label: 'Tasks' },
    { value: 'projects', label: 'Projects' },
    { value: 'workspaces', label: 'Workspaces' },
    { value: 'members', label: 'Members' },
    { value: 'settings', label: 'Settings' },
];

const ACTIONS = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
];

const TASK_STATUSES = ['Backlog', 'Todo', 'Doing', 'Done'];

export default function EditRoleModal({ isOpen, onClose, onSuccess, role }: EditRoleModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description);
            setPermissions(role.permissions);
        }
    }, [role]);

    const handleResourceToggle = (resource: string) => {
        const exists = permissions.find((p) => p.resource === resource);
        if (exists) {
            setPermissions(permissions.filter((p) => p.resource !== resource));
        } else {
            setPermissions([
                ...permissions,
                {
                    resource,
                    actions: { create: false, read: true, update: false, delete: false },
                    conditions: { own: false, assigned: false, status: [] },
                },
            ]);
        }
    };

    const handleActionToggle = (resource: string, action: string) => {
        setPermissions(
            permissions.map((p) =>
                p.resource === resource
                    ? { ...p, actions: { ...p.actions, [action]: !p.actions[action] } }
                    : p
            )
        );
    };

    const handleConditionToggle = (resource: string, condition: string) => {
        setPermissions(
            permissions.map((p) =>
                p.resource === resource
                    ? {
                          ...p,
                          conditions: {
                              ...p.conditions,
                              [condition]: !p.conditions[condition],
                          },
                      }
                    : p
            )
        );
    };

    const handleStatusToggle = (resource: string, status: string) => {
        setPermissions(
            permissions.map((p) => {
                if (p.resource === resource) {
                    const currentStatuses = p.conditions.status || [];
                    const newStatuses = currentStatuses.includes(status)
                        ? currentStatuses.filter((s: string) => s !== status)
                        : [...currentStatuses, status];
                    return {
                        ...p,
                        conditions: { ...p.conditions, status: newStatuses },
                    };
                }
                return p;
            })
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            await axios.patch(
                `http://localhost:8000/role/update-role/${role._id}`,
                {
                    name,
                    description,
                    permissions,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success('Role updated successfully');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    const getPermission = (resource: string) => {
        return permissions.find((p) => p.resource === resource);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Update permissions and settings for this role
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Role Name *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium">Permissions</h3>

                                {RESOURCES.map((resource) => {
                                    const perm = getPermission(resource.value);
                                    const isSelected = !!perm;

                                    return (
                                        <div key={resource.value} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edit-${resource.value}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleResourceToggle(resource.value)}
                                                />
                                                <Label
                                                    htmlFor={`edit-${resource.value}`}
                                                    className="font-semibold cursor-pointer"
                                                >
                                                    {resource.label}
                                                </Label>
                                            </div>

                                            {isSelected && (
                                                <div className="ml-6 space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium mb-2">Actions:</p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {ACTIONS.map((action) => (
                                                                <div key={action.value} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`edit-${resource.value}-${action.value}`}
                                                                        checked={perm.actions[action.value]}
                                                                        onCheckedChange={() =>
                                                                            handleActionToggle(resource.value, action.value)
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`edit-${resource.value}-${action.value}`}
                                                                        className="text-sm cursor-pointer"
                                                                    >
                                                                        {action.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {resource.value === 'tasks' && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2">Conditions:</p>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`edit-${resource.value}-own`}
                                                                        checked={perm.conditions.own}
                                                                        onCheckedChange={() =>
                                                                            handleConditionToggle(resource.value, 'own')
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`edit-${resource.value}-own`}
                                                                        className="text-sm cursor-pointer"
                                                                    >
                                                                        Only own resources
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`edit-${resource.value}-assigned`}
                                                                        checked={perm.conditions.assigned}
                                                                        onCheckedChange={() =>
                                                                            handleConditionToggle(resource.value, 'assigned')
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`edit-${resource.value}-assigned`}
                                                                        className="text-sm cursor-pointer"
                                                                    >
                                                                        Only assigned tasks
                                                                    </Label>
                                                                </div>

                                                                <div className="mt-2">
                                                                    <p className="text-xs text-muted-foreground mb-1">
                                                                        Allowed Statuses:
                                                                    </p>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {TASK_STATUSES.map((status) => (
                                                                            <div key={status} className="flex items-center space-x-2">
                                                                                <Checkbox
                                                                                    id={`edit-${resource.value}-${status}`}
                                                                                    checked={perm.conditions.status?.includes(status)}
                                                                                    onCheckedChange={() =>
                                                                                        handleStatusToggle(resource.value, status)
                                                                                    }
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`edit-${resource.value}-${status}`}
                                                                                    className="text-xs cursor-pointer"
                                                                                >
                                                                                    {status}
                                                                                </Label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}