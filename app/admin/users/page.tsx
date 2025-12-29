'use client'

import React, { useEffect, useState } from 'react'
import { SideNav } from '@/components/admin/SideNav'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, Building2, Store } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Profile {
    id: string
    email: string
    full_name: string
    role: string
}

interface Restaurant {
    id: string
    name: string
}

interface ManagerAssignment {
    id: string
    profile_id: string
    restaurant_id: string
    role: string
}

export default function UsersPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [assignments, setAssignments] = useState<ManagerAssignment[]>([])

    const [loading, setLoading] = useState(true)
    const [assigning, setAssigning] = useState<string | null>(null) // profile_id being assigned

    const fetchData = async () => {
        setLoading(true)
        // 1. Fetch Profiles
        const { data: profilesData } = await supabase.from('profiles').select('*')
        if (profilesData) setProfiles(profilesData)

        // 2. Fetch Restaurants
        const { data: restaurantsData } = await supabase.from('restaurants').select('*')
        if (restaurantsData) setRestaurants(restaurantsData)

        // 3. Fetch Existing Assignments
        const { data: assignmentsData } = await supabase.from('restaurant_managers').select('*')
        if (assignmentsData) setAssignments(assignmentsData)

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAssign = async (profileId: string, restaurantId: string) => {
        setAssigning(profileId)
        try {
            const { error } = await supabase
                .from('restaurant_managers')
                .insert({
                    profile_id: profileId,
                    restaurant_id: restaurantId,
                    role: 'owner'
                })

            if (error) {
                if (error.code === '23505') {
                    toast.error('User is already assigned to this restaurant')
                } else {
                    throw error
                }
            } else {
                toast.success('User assigned successfully')
                fetchData() // Refresh
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to assign')
        } finally {
            setAssigning(null)
        }
    }

    // Helper to check if a user is assigned to a specific restaurant
    const isAssigned = (profileId: string, restaurantId: string) => {
        return assignments.some(a => a.profile_id === profileId && a.restaurant_id === restaurantId)
    }

    const getAssignedRestaurantName = (profileId: string) => {
        const assignment = assignments.find(a => a.profile_id === profileId)
        if (!assignment) return null
        return restaurants.find(r => r.id === assignment.restaurant_id)?.name
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <SideNav />
            <div className="flex-1 md:ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Assign users to manage specific restaurants.</p>
                </div>

                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : profiles.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">No users found.</p>
                        ) : (
                            <div className="space-y-4">
                                {profiles.map((profile) => (
                                    <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border text-gray-400">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{profile.email || 'No Email'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs font-normal text-gray-500">
                                                        {profile.role}
                                                    </Badge>
                                                    {getAssignedRestaurantName(profile.id) && (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                            <Store className="h-3 w-3 mr-1" />
                                                            {getAssignedRestaurantName(profile.id)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Select
                                                disabled={assigning === profile.id}
                                                onValueChange={(val) => handleAssign(profile.id, val)}
                                            >
                                                <SelectTrigger className="w-[180px] bg-white">
                                                    <SelectValue placeholder="Assign Restaurant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {restaurants.map(r => (
                                                        <SelectItem
                                                            key={r.id}
                                                            value={r.id}
                                                            disabled={isAssigned(profile.id, r.id)}
                                                        >
                                                            {r.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
