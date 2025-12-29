'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function ScanTracker({ itemId }: { itemId: string }) {
    useEffect(() => {
        const logScan = async () => {
            const userAgent = navigator.userAgent
            const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
            const deviceType = isMobile ? 'Mobile' : 'Desktop'

            await supabase.from('scans').insert({
                menu_item_id: itemId, // Database will handle type coercion if needed
                device_type: deviceType,
                user_agent: userAgent
            })
        }

        logScan()
    }, [itemId])

    return null // Render nothing
}
