"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Shield, Users, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import useWorkspaceId from '@/hooks/useWorkSpaceId';
import { Badge } from '@/components/ui/badge';

export default function RolesGuidePage() {
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                    <CardTitle className="text-3xl flex items-center gap-3">
                        <Shield className="size-8 text-blue-600" />
                        Role Management Quick Start
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Follow these simple steps to set up roles and permissions for your team
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Step 1 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge className="text-lg px-4 py-2">Step 1</Badge>
                            <CardTitle className="text-xl">Navigate to Roles Page</CardTitle>
                        </div>
                        <CheckCircle className="size-6 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Click on the <strong>"Roles"</strong> option in the left sidebar (Shield icon 🛡️)
                    </p>
                    <div className="bg-slate-100 p-4 rounded-lg border-2 border-dashed">
                        <p className="font-mono text-sm">
                            <strong>Location:</strong> Left Sidebar → <Shield className="inline size-4" /> Roles
                        </p>
                        <p className="font-mono text-sm mt-2">
                            <strong>URL:</strong> /workspaces/{workspaceId}/roles
                        </p>
                    </div>
                    <Button asChild className="w-full" size="lg">
                        <Link href={`/workspaces/${workspaceId}/roles`}>
                            Go to Roles Page
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge className="text-lg px-4 py-2">Step 2</Badge>
                            <CardTitle className="text-xl">Click "Create Role" Button</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        On the Roles page, look for the blue button in the <strong>top-right corner</strong>
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Roles & Permissions</h3>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="size-4 mr-2" />
                                Create Role ← Click This!
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The button will open a modal where you can configure the new role
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Badge className="text-lg px-4 py-2">Step 3</Badge>
                        <CardTitle className="text-xl">Configure Role Permissions</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        In the modal, set up your role by:
                    </p>
                    <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="size-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Enter Role Name</p>
                                <p className="text-sm text-muted-foreground">
                                    e.g., "Developer", "Project Manager", "QA Tester"
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="size-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Add Description (Optional)</p>
                                <p className="text-sm text-muted-foreground">
                                    Brief explanation of the role's responsibilities
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="size-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Select Resource Permissions</p>
                                <p className="text-sm text-muted-foreground">
                                    Choose which resources (Tasks, Projects, etc.) this role can access
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="size-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Set Actions (CRUD)</p>
                                <p className="text-sm text-muted-foreground">
                                    Check boxes for Create, Read, Update, Delete permissions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="size-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Configure Conditions (Optional)</p>
                                <p className="text-sm text-muted-foreground">
                                    Set restrictions like "only assigned tasks" or specific statuses
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Badge className="text-lg px-4 py-2">Step 4</Badge>
                        <CardTitle className="text-xl">Assign Roles to Members</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        After creating roles, assign them to team members
                    </p>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Users className="size-5" />
                            <p className="font-semibold">Go to Members Page</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Find members in the table → Use the dropdown in "Actions" column → Select a role
                        </p>
                    </div>
                    <Button asChild className="w-full" size="lg" variant="outline">
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <Users className="mr-2" />
                            Go to Members Page
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Example Roles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="size-5" />
                        Example Role Configurations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-blue-600">Developer</h4>
                            <div className="text-sm space-y-1">
                                <p>✅ View tasks</p>
                                <p>✅ Edit assigned tasks</p>
                                <p>✅ View projects</p>
                                <p>❌ Cannot delete anything</p>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-green-600">Project Manager</h4>
                            <div className="text-sm space-y-1">
                                <p>✅ Full task access</p>
                                <p>✅ Create/edit projects</p>
                                <p>✅ View members</p>
                                <p>✅ Update settings</p>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-purple-600">QA Tester</h4>
                            <div className="text-sm space-y-1">
                                <p>✅ View all tasks</p>
                                <p>✅ Edit "Done" status only</p>
                                <p>✅ View projects</p>
                                <p>❌ Cannot create tasks</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button asChild variant="default">
                        <Link href={`/workspaces/${workspaceId}/roles`}>
                            <Shield className="mr-2 size-4" />
                            Manage Roles
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <Users className="mr-2 size-4" />
                            Manage Members
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/workspaces/${workspaceId}`}>
                            <ArrowRight className="mr-2 size-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}