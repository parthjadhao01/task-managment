"use client";
import React, { useState } from 'react';
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

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    workspaceId: string;
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

export default function CreateRoleModal({
    isOpen,
    onClose,
    onSuccess,
    workspaceId,
}: CreateRoleModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
        
        if (!name.trim()) {
            toast.error('Role name is required');
            return;
        }

        if (permissions.length === 0) {
            toast.error('Please select at least one resource permission');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.post(
                'http://localhost:8000/role/create-role',
                {
                    name,
                    description,
                    workspaceId,
                    permissions,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success('Role created successfully');
            setName('');
            setDescription('');
            setPermissions([]);
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create role');
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
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                        Define a custom role with specific permissions for your workspace
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Role Name *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Project Manager, Developer"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe this role's responsibilities..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Permissions */}
                            <div className="space-y-4">
                                <h3 className="font-medium">Permissions</h3>
                                
                                {RESOURCES.map((resource) => {
                                    const perm = getPermission(resource.value);
                                    const isSelected = !!perm;

                                    return (
                                        <div key={resource.value} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={resource.value}
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleResourceToggle(resource.value)}
                                                />
                                                <Label
                                                    htmlFor={resource.value}
                                                    className="font-semibold cursor-pointer"
                                                >
                                                    {resource.label}
                                                </Label>
                                            </div>

                                            {isSelected && (
                                                <div className="ml-6 space-y-3">
                                                    {/* Actions */}
                                                    <div>
                                                        <p className="text-sm font-medium mb-2">Actions:</p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {ACTIONS.map((action) => (
                                                                <div key={action.value} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`${resource.value}-${action.value}`}
                                                                        checked={perm.actions[action.value]}
                                                                        onCheckedChange={() =>
                                                                            handleActionToggle(resource.value, action.value)
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`${resource.value}-${action.value}`}
                                                                        className="text-sm cursor-pointer"
                                                                    >
                                                                        {action.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Conditions */}
                                                    {resource.value === 'tasks' && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2">Conditions:</p>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`${resource.value}-own`}
                                                                        checked={perm.conditions.own}
                                                                        onCheckedChange={() =>
                                                                            handleConditionToggle(resource.value, 'own')
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`${resource.value}-own`}
                                                                        className="text-sm cursor-pointer"
                                                                    >
                                                                        Only own resources
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`${resource.value}-assigned`}
                                                                        checked={perm.conditions.assigned}
                                                                        onCheckedChange={() =>
                                                                            handleConditionToggle(resource.value, 'assigned')
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`${resource.value}-assigned`}
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
                                                                                    id={`${resource.value}-${status}`}
                                                                                    checked={perm.conditions.status?.includes(status)}
                                                                                    onCheckedChange={() =>
                                                                                        handleStatusToggle(resource.value, status)
                                                                                    }
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`${resource.value}-${status}`}
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
                            {loading ? 'Creating...' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}