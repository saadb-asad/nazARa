import { supabase } from '@/lib/supabase'
import ARViewer from '@/components/ARViewer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ScanTracker } from '@/components/ScanTracker'

// We force dynamic rendering so we always get the latest data
export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewItemPage({ params }: PageProps) {
    const { id } = await params

    // Fetch item server-side
    const { data: item, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !item) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar / Header */}
            <div className="p-4 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <span className="font-semibold text-lg ml-2">NazARa Menu</span>
            </div>

            <main className="p-4 md:max-w-md mx-auto space-y-6">
                {/* AR Viewer Section */}
                <ScanTracker itemId={item.id} />
                <section>
                    <ARViewer
                        src={item.model_url}
                        alt={`3D model of ${item.name}`}
                    />
                    <p className="text-xs text-center text-gray-400 mt-2">
                        Tap "View in AR" to see it on your table.
                    </p>
                </section>

                {/* Item Details */}
                <section className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                        <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                            PKR {item.price}
                        </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        {item.description || "No description available."}
                    </p>
                </section>

                {/* Floating Action Button (Example) */}
                <div className="fixed bottom-6 left-4 right-4 md:static md:w-full">
                    <Button className="w-full text-lg h-12 shadow-xl">
                        Order This Item
                    </Button>
                </div>
            </main>
        </div>
    )
}
