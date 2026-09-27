import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, FileDown, Plus, Mail, ArrowUpDown } from "lucide-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RosterUser {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'employee' | 'admin';
    group: string;
    avgWpm: number;
    lastActive: string;
    status: 'active' | 'inactive';
}

const MOCK_USERS: RosterUser[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@school.edu', role: 'student', group: 'Class 5A', avgWpm: 45, lastActive: '2 hours ago', status: 'active' },
    { id: '2', name: 'Bob Smith', email: 'bob@school.edu', role: 'student', group: 'Class 5A', avgWpm: 32, lastActive: '1 day ago', status: 'active' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@school.edu', role: 'student', group: 'Class 5B', avgWpm: 28, lastActive: '3 days ago', status: 'inactive' },
    { id: '4', name: 'Diana Prince', email: 'diana@corp.com', role: 'employee', group: 'Sales', avgWpm: 65, lastActive: '5 mins ago', status: 'active' },
    { id: '5', name: 'Evan Wright', email: 'evan@corp.com', role: 'employee', group: 'Engineering', avgWpm: 82, lastActive: '1 hour ago', status: 'active' },
];

interface StudentRosterProps {
    type: 'school' | 'business';
}

export const StudentRoster: React.FC<StudentRosterProps> = ({ type }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<RosterUser[]>(MOCK_USERS);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof RosterUser; direction: 'asc' | 'desc' } | null>(null);
    const [newUser, setNewUser] = useState<Partial<RosterUser>>({
        role: type === 'school' ? 'student' : 'employee',
        status: 'active',
        avgWpm: 0,
        lastActive: 'Just now'
    });

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof RosterUser) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.group) {
            toast.error("Please fill in all required fields");
            return;
        }
        const user: RosterUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as any,
            group: newUser.group,
            avgWpm: 0,
            lastActive: 'Just now',
            status: 'active'
        };
        setUsers([...users, user]);
        setIsAddUserOpen(false);
        setNewUser({ role: type === 'school' ? 'student' : 'employee', status: 'active', avgWpm: 0, lastActive: 'Just now' });
        toast.success("User added successfully");
    };

    const handleEmail = (email: string) => {
        toast.info(`Drafting email to ${email}`);
        window.location.href = `mailto:${email}`;
    };

    const handleExport = () => {
        toast.success("Exporting CSV...");
        // Implement CSV export logic here
    };

    return (
        <Card className="bg-gradient-to-br from-secondary/30 to-background border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {type === 'school' ? 'Student Roster' : 'Team Members'}
                    <Badge variant="secondary" className="ml-2 font-normal text-xs">
                        {users.length} Total
                    </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                        <FileDown className="w-4 h-4" />
                        Export
                    </Button>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4" />
                                Add {type === 'school' ? 'Student' : 'Member'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0a] border-white/10 sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New {type === 'school' ? 'Student' : 'Team Member'}</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new user. They will receive an invitation email.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newUser.name || ''}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newUser.email || ''}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="group" className="text-right">
                                        {type === 'school' ? 'Class' : 'Dept'}
                                    </Label>
                                    <Input
                                        id="group"
                                        value={newUser.group || ''}
                                        onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        Role
                                    </Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                                    >
                                        <SelectTrigger className="col-span-3 bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="employee">Employee</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddUser} className="bg-emerald-600 hover:bg-emerald-700">Add User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or group..."
                            className="pl-9 bg-secondary/20 border-white/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Add Filter Dropdowns here if needed */}
                </div>

                <div className="rounded-md border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-secondary/20">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                                    Name <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                </TableHead>
                                <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('role')}>
                                    Role <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                </TableHead>
                                <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('group')}>
                                    {type === 'school' ? 'Class' : 'Department'} <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                </TableHead>
                                <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('avgWpm')}>
                                    Avg. WPM <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                </TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedUsers.map((user) => (
                                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize text-[10px]">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.group}</TableCell>
                                        <TableCell>
                                            <div className="font-mono font-medium text-emerald-400">
                                                {user.avgWpm}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                                                <span className="text-sm capitalize text-muted-foreground">{user.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-black/90 border-white/10 backdrop-blur-xl">
                                                    <DropdownMenuItem onClick={() => handleEmail(user.email)} className="gap-2 cursor-pointer">
                                                        <Mail className="w-4 h-4" /> Email User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-400 focus:text-red-400">
                                                        Remove User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
