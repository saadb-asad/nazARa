'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LayoutDashboard, LogOut, QrCode as QrIcon, MapPin, Store, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'


interface Restaurant {
    id: string
    name: string
}

export function SideNav() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentRestaurant = searchParams.get('restaurant')

    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    const fetchData = async () => {
        // 1. Fetch Restaurants
        const { data: restData } = await supabase.from('restaurants').select('*').order('name')
        if (restData) setRestaurants(restData)

        // 2. Fetch User Role
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
            if (profile && profile.role === 'super_admin') {
                setIsSuperAdmin(true)
            }
        }
    }

    useEffect(() => {
        fetchData()

        // Subscribe to new restaurants
        const channel = supabase
            .channel('restaurants_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => {
                fetchData()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    return (
        <div className="w-64 h-screen bg-white shadow-xl fixed left-0 top-0 flex flex-col justify-between z-20 hidden md:flex">

            {/* Top Section */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {/* Logo */}
                <div className="mb-10 px-2 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
                    <h1 className="text-2xl font-bold tracking-wider">
                        NAZ<span className="text-primary">AR</span>A
                    </h1>
                </div>

                {/* Generic Nav */}
                <div className="mb-8">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</h3>
                    <Link href="/admin/dashboard">
                        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/dashboard' && !currentRestaurant ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <LayoutDashboard className="h-4 w-4" />
                            All Items
                        </div>
                    </Link>

                    {isSuperAdmin && (
                        <>
                            <Link href="/admin/users">
                                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/users' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Users className="h-4 w-4" />
                                    Users & Access
                                </div>
                            </Link>

                            <Link href="/admin/restaurants">
                                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/restaurants' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Store className="h-4 w-4" />
                                    Manage Restaurants
                                </div>
                            </Link>
                        </>
                    )}
                </div>

                {/* Restaurants List */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Restaurants</h3>
                    </div>

                    <nav className="space-y-1 mb-4">
                        {restaurants.map((res) => {
                            const isActive = currentRestaurant === res.name
                            return (
                                <Link key={res.id} href={`/admin/dashboard?restaurant=${encodeURIComponent(res.name)}`}>
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Store className="h-4 w-4" />
                                        <span className="truncate">{res.name}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                </div>
            </div>

            {/* Footer / Logout */}
            <div className="p-6 bg-gray-50">
                <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                </Button>
            </div>
        </div >
    )
}
