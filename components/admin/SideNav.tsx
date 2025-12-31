'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LayoutDashboard, LogOut, QrCode as QrIcon, MapPin, Store, Users, Menu, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { ModeToggle } from '@/components/mode-toggle'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"

interface Restaurant {
    id: string
    name: string
}

function SideNavContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentRestaurant = searchParams.get('restaurant')

    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [userName, setUserName] = useState<string>('')

    const fetchData = async () => {
        // 1. Fetch Restaurants
        const { data: restData } = await supabase.from('restaurants').select('*').order('name')
        if (restData) setRestaurants(restData)

        // 2. Fetch User Role & Name
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role, full_name, email').eq('id', user.id).single()
            if (profile) {
                setUserName(profile.full_name || profile.email || 'Admin')
                if (profile.role === 'super_admin') {
                    setIsSuperAdmin(true)
                }
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
        <>
            {/* Desktop SideNav (Floating Card) */}
            <div className="w-64 h-[calc(100vh-2rem)] m-4 bg-white dark:bg-card text-gray-800 dark:text-white shadow-2xl fixed left-0 top-0 flex flex-col justify-between z-50 hidden md:flex rounded-2xl border border-gray-100 dark:border-gray-800">

                {/* Top Section */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {/* Logo */}
                    <div className="mb-10 px-2 flex justify-between items-center">
                        <div className="cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
                            <h1 className="text-2xl font-bold tracking-wider">
                                NAZ<span className="text-primary">AR</span>A
                            </h1>
                        </div>
                        <ModeToggle />
                    </div>

                    {/* Generic Nav */}
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</h3>
                        <Link href="/admin/dashboard">
                            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/dashboard' && !currentRestaurant ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                <LayoutDashboard className="h-4 w-4" />
                                All Items
                            </div>
                        </Link>

                        {isSuperAdmin && (
                            <>
                                <Link href="/admin/users">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/users' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <Users className="h-4 w-4" />
                                        Users & Access
                                    </div>
                                </Link>

                                <Link href="/admin/restaurants">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin/restaurants' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
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
                                        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
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
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
                    <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                    </Button>
                </div>
            </div >

            {/* Mobile Top Bar (Floating Pill) */}
            <div className="fixed top-4 left-4 right-4 h-16 bg-white dark:bg-card shadow-xl rounded-2xl z-50 flex items-center justify-between px-6 md:hidden border border-gray-100 dark:border-gray-800">

                {/* Hamburger (Opens Sheet) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-0">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">Main navigation menu for the admin dashboard</SheetDescription>
                        {/* Reusing the sidebar structure inside the sheet, simplified */}
                        <div className="h-full bg-white dark:bg-card flex flex-col">
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <h1 className="text-2xl font-bold tracking-wider">
                                            NAZ<span className="text-primary">AR</span>A
                                        </h1>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Hi, {userName}</p>
                                </div>

                                {/* Mobile Nav Links (Copy of Desktop) */}
                                <div className="space-y-1">
                                    <Link href="/admin/dashboard">
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${pathname === '/admin/dashboard' && !currentRestaurant ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                            <LayoutDashboard className="h-5 w-5" />
                                            All Items
                                        </div>
                                    </Link>
                                    {isSuperAdmin && (
                                        <>
                                            <Link href="/admin/users">
                                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${pathname === '/admin/users' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                                    <Users className="h-5 w-5" />
                                                    Users
                                                </div>
                                            </Link>
                                            <Link href="/admin/restaurants">
                                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${pathname === '/admin/restaurants' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                                    <Store className="h-5 w-5" />
                                                    Restaurants
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Restaurants</h3>
                                    <div className="space-y-1">
                                        {restaurants.map((res) => (
                                            <Link key={res.id} href={`/admin/dashboard?restaurant=${encodeURIComponent(res.name)}`}>
                                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${currentRestaurant === res.name ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                                    <Store className="h-5 w-5" />
                                                    <span className="truncate">{res.name}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Theme</span>
                                <ModeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Center Logo */}
                <div className="flex items-center gap-2" onClick={() => router.push('/admin/dashboard')}>
                    <h1 className="text-xl font-bold tracking-wider">
                        NAZ<span className="text-primary">AR</span>A
                    </h1>
                </div>

                {/* Right Action (Logout) */}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="-mr-2 text-gray-500 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </>
    )
}

export function SideNav() {
    return (
        <Suspense fallback={
            <div className="hidden md:flex w-64 h-[calc(100vh-2rem)] m-4 bg-white dark:bg-card shadow-2xl fixed left-0 top-0 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SideNavContent />
        </Suspense>
    )
}
