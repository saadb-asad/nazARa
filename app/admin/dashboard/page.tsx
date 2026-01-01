'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { QRCodeDialog } from '@/components/admin/QRCodeDialog'
import { SideNav } from '@/components/admin/SideNav'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Trash2, ExternalLink, TrendingUp, Users, Box, Loader2, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    model_url: string
    restaurant_name: string
}

interface ScanData {
    id: string
    menu_item_id: any
    scanned_at: string
    user_agent: string
}

function DashboardContent() {
    const searchParams = useSearchParams()
    const currentRestaurant = searchParams.get('restaurant') || 'All'

    const [items, setItems] = useState<MenuItem[]>([])
    const [scans, setScans] = useState<ScanData[]>([])
    const [loading, setLoading] = useState(true)
    const [qrItem, setQrItem] = useState<{ id: string, name: string } | null>(null)

    const fetchData = async () => {
        setLoading(true)

        // 1. Fetch Menu Items
        const { data: menuData } = await supabase
            .from('menu_items')
            .select('*')
            .order('created_at', { ascending: false })

        if (menuData) setItems(menuData as any)

        // 2. Fetch Scans
        const { data: scanData } = await supabase
            .from('scans')
            .select('*, menu_items(restaurant_name)')
            .order('scanned_at', { ascending: false })

        if (scanData) setScans(scanData as any)



        setLoading(false)
    }

    useEffect(() => {
        fetchData()

        const channel = supabase.channel('dashboard_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, fetchData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const deleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        await supabase.from('menu_items').delete().eq('id', id)
    }

    // Filter Logic
    const filteredItems = currentRestaurant === 'All'
        ? items
        : items.filter(i => (i.restaurant_name || 'Uncategorized') === currentRestaurant)

    const filteredScans = currentRestaurant === 'All'
        ? scans
        : scans.filter((s: any) => s.menu_items?.restaurant_name === currentRestaurant)

    // Prepare Chart Data (Last 7 Days)
    const getChartData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const today = new Date()
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(today.getDate() - (6 - i))
            return d
        })

        return last7Days.map(date => {
            const dateStr = date.toISOString().split('T')[0]
            const count = filteredScans.filter(s => s.scanned_at.startsWith(dateStr)).length
            return {
                name: days[date.getDay()],
                total: count
            }
        })
    }

    return (
        <div className="flex-1 md:ml-72 p-8 pt-24 md:pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {currentRestaurant === 'All' ? 'Overview' : currentRestaurant}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {currentRestaurant === 'All' ? 'Manage all your menus in one place.' : `Manage items for ${currentRestaurant}.`}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Items Listed</h3>
                            <span className="text-3xl font-bold mt-2 block text-card-foreground">{filteredItems.length}</span>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                            <Box className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="w-full bg-muted h-1 mt-4 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[70%] rounded-full" />
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
                            <span className="text-3xl font-bold mt-2 block text-card-foreground">{filteredScans.length}</span>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Real-time interactions</p>
                </div>

                {currentRestaurant === 'All' && (
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Total Branches</h3>
                                <span className="text-3xl font-bold mt-2 block text-card-foreground">
                                    {new Set(items.map(i => i.restaurant_name)).size}
                                </span>
                            </div>
                            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-xs text-green-500 mt-4">Active & Live</p>
                    </div>
                )}
            </div>

            {/* Analytics Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-10">
                <div className="lg:col-span-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-card-foreground">Activity Overview</h3>
                        <p className="text-sm text-muted-foreground">Scans over the last 7 days</p>
                    </div>
                    <AnalyticsChart data={getChartData()} />
                </div>

                {/* Recent Activity Feed */}
                <div className="lg:col-span-3 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="text-lg font-semibold mb-6 text-card-foreground">Recent Activity</h3>
                    <div className="space-y-6">
                        {filteredScans.slice(0, 5).map((scan, i) => (
                            <div key={scan.id || i} className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mr-4">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-card-foreground">
                                        Item Viewed
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(scan.scanned_at).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Via {scan.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {filteredScans.length === 0 && (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div>
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
                    Menu Items
                    <span className="text-xs font-normal text-muted-foreground bg-card px-2 py-1 rounded-full border border-border">
                        {filteredItems.length}
                    </span>
                </h2>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-card p-16 text-center rounded-2xl border border-dashed border-border">
                        <div className="mx-auto h-16 w-16 text-muted-foreground mb-4 bg-muted rounded-full flex items-center justify-center">
                            <QrCode className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No items found</h3>
                        <p className="text-muted-foreground mb-4">
                            {currentRestaurant === 'All' ? "Add your first item to get started." : `Add an item to ${currentRestaurant}.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border shadow-sm group bg-card rounded-2xl">
                                <div className="aspect-[4/3] bg-muted relative flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">3D Model</span>
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-background/90 backdrop-blur p-2 rounded-full cursor-pointer hover:text-destructive" onClick={() => deleteItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                                            {item.restaurant_name || 'Uncategorized'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-card-foreground line-clamp-1">{item.name}</h3>
                                        <span className="text-sm font-semibold text-card-foreground">Rs. {item.price}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-6 h-8">{item.description}</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                                            size="sm"
                                            onClick={() => setQrItem({ id: item.id, name: item.name })}
                                        >
                                            <QrCode className="mr-2 h-3.5 w-3.5" /> Print QR
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full rounded-xl border-border hover:bg-muted">
                                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> Preview
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <QRCodeDialog
                open={!!qrItem}
                onOpenChange={(open) => !open && setQrItem(null)}
                itemId={qrItem?.id || ''}
                itemName={qrItem?.name || ''}
            />
        </div>
    )
}

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <SideNav />
            <Suspense fallback={<div className="p-8">Loading...</div>}>
                <DashboardContent />
            </Suspense>
        </div>
    )
}
