'use client'

import React, { useEffect, useState } from 'react'
import { SideNav } from '@/components/admin/SideNav'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Store, Users, Trash2, Edit2, Save, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"


interface Restaurant {
    id: string
    name: string
    address?: string
    created_at: string
}

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    // Create State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [creating, setCreating] = useState(false)

    const fetchRestaurants = async () => {
        setLoading(true)
        const { data } = await supabase.from('restaurants').select('*').order('name')
        if (data) setRestaurants(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchRestaurants()
    }, [])

    // --- Actions ---

    const handleCreate = async () => {
        if (!newName.trim()) return
        setCreating(true)
        try {
            const { error } = await supabase.from('restaurants').insert({ name: newName.trim() })
            if (error) throw error
            toast.success('Restaurant created successfully')
            setNewName('')
            setIsCreateOpen(false)
            fetchRestaurants()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create')
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This handles items and managers as well.`)) return
        try {
            const { error } = await supabase.from('restaurants').delete().eq('id', id)
            if (error) throw error
            toast.success('Restaurant deleted')
            setRestaurants(prev => prev.filter(r => r.id !== id))
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete')
        }
    }

    const startEdit = (r: Restaurant) => {
        setEditingId(r.id)
        setEditName(r.name)
    }

    const saveEdit = async () => {
        if (!editingId || !editName.trim()) return
        try {
            const { error } = await supabase
                .from('restaurants')
                .update({ name: editName.trim() })
                .eq('id', editingId)

            if (error) throw error
            toast.success('Restaurant updated')
            setRestaurants(prev => prev.map(r => r.id === editingId ? { ...r, name: editName.trim() } : r))
            setEditingId(null)
        } catch (error: any) {
            toast.error(error.message || 'Failed to update')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <SideNav />
            <div className="flex-1 md:ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Restaurant Management</h1>
                        <p className="text-gray-500 mt-1">Add, rename, or remove restaurant locations.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-gray-900 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Restaurant
                    </Button>
                </div>

                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>All Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : restaurants.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">No restaurants found.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {restaurants.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell className="font-medium">
                                                {editingId === res.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={editName}
                                                            onChange={e => setEditName(e.target.value)}
                                                            className="h-8 w-64"
                                                        />
                                                        <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg">
                                                            <Store className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                        {res.name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-xs">
                                                {new Date(res.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {!editingId && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => startEdit(res)}
                                                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(res.id, res.name)}
                                                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Restaurant</DialogTitle>
                            <DialogDescription>Create a new location to manage menus.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Name</label>
                                <Input
                                    placeholder="e.g. Downtown Branch"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
