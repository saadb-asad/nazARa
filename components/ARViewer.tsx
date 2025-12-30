'use client'

import { useEffect, useRef } from 'react'
import '@google/model-viewer/lib/model-viewer'

// Bypass TypeScript custom element check by casting to any
const ModelViewer = 'model-viewer' as any

interface ARViewerProps {
    src: string
    poster?: string
    alt: string
}

export default function ARViewer({ src, poster, alt }: ARViewerProps) {
    const viewerRef = useRef<any>(null)

    return (
        <div className="w-full h-[400px] bg-gray-50 rounded-xl overflow-hidden relative">
            <ModelViewer
                ref={viewerRef}
                src={src}
                ios-src="" // You can add USDZ here later if needed, but model-viewer auto-converts often
                poster={poster}
                alt={alt}
                ar
                ar-modes="scene-viewer webxr quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%' }}
            >
                <button slot="ar-button" className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full font-medium shadow-lg flex items-center gap-2">
                    <span>View in AR</span>
                </button>
            </ModelViewer>
        </div>
    )
}
