"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader, Shield, Users, Plus, Briefcase, Settings, Trash2, Edit, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useWorkspaceId from '@/hooks/useWorkSpaceId';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Permission {
    resource: "tasks" | "projects" | "workspaces" | "members" | "settings";
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

interface Role {
    _id: string;
    name: string;
    description: string;
    workspaceId: string;
    permissions: Permission[];
    isSystemRole: boolean;
    createdBy: {
        _id: string;
        username: string;
        email: string;
    };
    createdAt: string;
}

interface Member {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    workspaceId: string;
    role: string;
    roleId?: {
        _id: string;
        name: string;
    };
}

const RESOURCES = [
    { value: "tasks", label: "Tasks", icon: "📋" },
    { value: "projects", label: "Projects", icon: "📁" },
    { value: "workspaces", label: "Workspaces", icon: "🏢" },
    { value: "members", label: "Members", icon: "👥" },
    { value: "settings", label: "Settings", icon: "⚙️" }
];

const ACTIONS = [
    { value: "create", label: "Create" },
    { value: "read", label: "Read" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" }
];

const STATUSES = ["Backlog", "Todo", "Doing", "Done"];

export default function MembersPage() {
    const workspaceId = useWorkspaceId();
    const [members, setMembers] = useState<Member[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
    const [isViewRoleOpen, setIsViewRoleOpen] = useState(false);
    const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
    
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: [] as Permission[],
    });

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8000/member/get-members/${workspaceId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMembers(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load members');
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8000/role/get-roles/${workspaceId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchMembers(), fetchRoles()]);
            setLoading(false);
        };

        if (workspaceId) {
            fetchData();
        }
    }, [workspaceId]);

    const handleRoleAssignment = async (memberId: string, roleId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:8000/role/assign-role',
                { memberId, roleId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Role assigned successfully');
            fetchMembers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign role');
        }
    };

    const addPermission = () => {
        setNewRole({
            ...newRole,
            permissions: [
                ...newRole.permissions,
                {
                    resource: "tasks",
                    actions: { create: false, read: false, update: false, delete: false },
                    conditions: { own: false, assigned: false, status: [] }
                }
            ]
        });
    };

    const updatePermission = (index: number, field: string, value: any) => {
        const updatedPermissions = [...newRole.permissions];
        if (field.startsWith('actions.')) {
            const action = field.split('.')[1];
            updatedPermissions[index].actions[action as keyof Permission['actions']] = value;
        } else if (field.startsWith('conditions.')) {
            const condition = field.split('.')[1];
            if (condition === 'status') {
                updatedPermissions[index].conditions.status = value;
            } else {
                updatedPermissions[index].conditions[condition as 'own' | 'assigned'] = value;
            }
        } else if (field === 'resource') {
            updatedPermissions[index].resource = value;
        }
        setNewRole({ ...newRole, permissions: updatedPermissions });
    };

    const removePermission = (index: number) => {
        setNewRole({
            ...newRole,
            permissions: newRole.permissions.filter((_, i) => i !== index)
        });
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newRole.name.trim()) {
            toast.error('Role name is required');
            return;
        }

        setIsCreatingRole(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:8000/role/create-role',
                { ...newRole, workspaceId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Role created successfully');
            setNewRole({ name: '', description: '', permissions: [] });
            setIsCreateRoleOpen(false);
            fetchRoles();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create role');
        } finally {
            setIsCreatingRole(false);
        }
    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:8000/role/delete-role/${roleToDelete}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Role deleted successfully');
            setRoleToDelete(null);
            fetchRoles();
            fetchMembers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        }
    };

    const viewRoleDetails = (role: Role) => {
        setSelectedRole(role);
        setIsViewRoleOpen(true);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="members" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="members">
                        <Users className="size-4 mr-2" />
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="roles">
                        <Briefcase className="size-4 mr-2" />
                        Roles
                    </TabsTrigger>
                </TabsList>

                {/* MEMBERS TAB */}
                <TabsContent value="members" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="size-5" />
                                        Team Members
                                    </CardTitle>
                                    <CardDescription>
                                        Manage team members and assign roles
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">
                                    {members.length} {members.length === 1 ? 'Member' : 'Members'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Assigned Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                                                            {member.userId.username[0].toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">
                                                        {member.userId.username}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {member.userId.email}
                                            </TableCell>
                                            <TableCell>
                                                {member.role === 'admin' ? (
                                                    <Badge variant="default" className="gap-1">
                                                        <Shield className="size-3" />
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Member</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {member.roleId ? (
                                                    <Badge variant="outline">
                                                        {member.roleId.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        No role assigned
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {member.role !== 'admin' && (
                                                    <Select
                                                        onValueChange={(value) =>
                                                            handleRoleAssignment(member._id, value)
                                                        }
                                                        value={member.roleId?._id || ''}
                                                        disabled={roles.length === 0}
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder={
                                                                roles.length === 0 
                                                                    ? "No roles available" 
                                                                    : "Assign role"
                                                            } />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roles.map((role) => (
                                                                <SelectItem key={role._id} value={role._id}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {members.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Users className="size-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No members in this workspace</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROLES TAB */}
                <TabsContent value="roles" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="size-5" />
                                        Roles & Permissions
                                    </CardTitle>
                                    <CardDescription>
                                        Create and manage custom roles with specific permissions
                                    </CardDescription>
                                </div>
                                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="size-4 mr-2" />
                                            Create Role
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <form onSubmit={handleCreateRole}>
                                            <DialogHeader>
                                                <DialogTitle>Create New Role</DialogTitle>
                                                <DialogDescription>
                                                    Define a custom role with specific permissions
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-6 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="role-name">Role Name *</Label>
                                                    <Input
                                                        id="role-name"
                                                        placeholder="e.g., Project Manager, Lead Developer"
                                                        value={newRole.name}
                                                        onChange={(e) =>
                                                            setNewRole({ ...newRole, name: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="role-description">Description</Label>
                                                    <Textarea
                                                        id="role-description"
                                                        placeholder="Describe the role and its responsibilities..."
                                                        value={newRole.description}
                                                        onChange={(e) =>
                                                            setNewRole({ ...newRole, description: e.target.value })
                                                        }
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-base">Permissions</Label>
                                                        <Button type="button" variant="outline" size="sm" onClick={addPermission}>
                                                            <Plus className="size-4 mr-2" />
                                                            Add Permission
                                                        </Button>
                                                    </div>

                                                    {newRole.permissions.map((permission, index) => (
                                                        <Card key={index}>
                                                            <CardContent className="pt-6 space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <Select
                                                                        value={permission.resource}
                                                                        onValueChange={(value) => updatePermission(index, 'resource', value)}
                                                                    >
                                                                        <SelectTrigger className="w-[200px]">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {RESOURCES.map((resource) => (
                                                                                <SelectItem key={resource.value} value={resource.value}>
                                                                                    {resource.icon} {resource.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removePermission(index)}
                                                                    >
                                                                        <Trash2 className="size-4 text-destructive" />
                                                                    </Button>
                                                                </div>

                                                                <div>
                                                                    <Label className="text-sm mb-2 block">Actions</Label>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {ACTIONS.map((action) => (
                                                                            <div key={action.value} className="flex items-center space-x-2">
                                                                                <Checkbox
                                                                                    id={`${index}-${action.value}`}
                                                                                    checked={permission.actions[action.value as keyof Permission['actions']]}
                                                                                    onCheckedChange={(checked) =>
                                                                                        updatePermission(index, `actions.${action.value}`, checked)
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    htmlFor={`${index}-${action.value}`}
                                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                >
                                                                                    {action.label}
                                                                                </label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {permission.resource === 'tasks' && (
                                                                    <div className="space-y-3">
                                                                        <Label className="text-sm">Conditions</Label>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Switch
                                                                                id={`${index}-own`}
                                                                                checked={permission.conditions.own}
                                                                                onCheckedChange={(checked : any) =>
                                                                                    updatePermission(index, 'conditions.own', checked)
                                                                                }
                                                                            />
                                                                            <Label htmlFor={`${index}-own`} className="font-normal">
                                                                                Only own tasks
                                                                            </Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Switch
                                                                                id={`${index}-assigned`}
                                                                                checked={permission.conditions.assigned}
                                                                                onCheckedChange={(checked : any) =>
                                                                                    updatePermission(index, 'conditions.assigned', checked)
                                                                                }
                                                                            />
                                                                            <Label htmlFor={`${index}-assigned`} className="font-normal">
                                                                                Only assigned tasks
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    ))}

                                                    {newRole.permissions.length === 0 && (
                                                        <div className="text-center py-8 text-muted-foreground">
                                                            No permissions added yet. Click "Add Permission" to get started.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsCreateRoleOpen(false)}
                                                    disabled={isCreatingRole}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={isCreatingRole}>
                                                    {isCreatingRole ? (
                                                        <>
                                                            <Loader className="size-4 mr-2 animate-spin" />
                                                            Creating...
                                                        </>
                                                    ) : (
                                                        'Create Role'
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {roles.length > 0 ? (
                                <div className="space-y-3">
                                    {roles.map((role) => (
                                        <Card key={role._id}>
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-lg">{role.name}</h3>
                                                            {role.isSystemRole && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    System Role
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {role.description || 'No description provided'}
                                                        </p>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {role.permissions.length} {role.permissions.length === 1 ? 'Permission' : 'Permissions'}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                Created by {role.createdBy.username}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => viewRoleDetails(role)}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                        {!role.isSystemRole && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setRoleToDelete(role._id)}
                                                            >
                                                                <Trash2 className="size-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Briefcase className="size-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-4">No roles created yet</p>
                                    <Button onClick={() => setIsCreateRoleOpen(true)}>
                                        <Plus className="size-4 mr-2" />
                                        Create Your First Role
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* View Role Dialog */}
            <Dialog open={isViewRoleOpen} onOpenChange={setIsViewRoleOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedRole && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {selectedRole.name}
                                    {selectedRole.isSystemRole && (
                                        <Badge variant="secondary">System Role</Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedRole.description || 'No description provided'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <h4 className="font-semibold mb-3">Permissions</h4>
                                    {selectedRole.permissions.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedRole.permissions.map((permission, index) => (
                                                <Card key={index}>
                                                    <CardContent className="pt-4">
                                                        <div className="space-y-3">
                                                            <div className="font-medium">
                                                                {RESOURCES.find(r => r.value === permission.resource)?.icon}{' '}
                                                                {RESOURCES.find(r => r.value === permission.resource)?.label}
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(permission.actions).map(([action, enabled]) => (
                                                                    enabled && (
                                                                        <Badge key={action} variant="secondary">
                                                                            {action}
                                                                        </Badge>
                                                                    )
                                                                ))}
                                                            </div>
                                                            {(permission.conditions.own || permission.conditions.assigned) && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    Conditions:{' '}
                                                                    {permission.conditions.own && 'Own only'}
                                                                    {permission.conditions.own && permission.conditions.assigned && ', '}
                                                                    {permission.conditions.assigned && 'Assigned only'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No permissions defined</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the role and remove it from all members. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground">
                            Delete Role
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}