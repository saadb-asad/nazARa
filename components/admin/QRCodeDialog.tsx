'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"

interface QRCodeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemId: string
    itemName: string
}

export function QRCodeDialog({ open, onOpenChange, itemId, itemName }: QRCodeDialogProps) {
    const viewUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/view/${itemId}`
        : `https://nazara.app/view/${itemId}`

    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML
        if (!printContent) return

        const win = window.open('', '', 'width=800,height=600')
        if (win) {
            win.document.write(`
            <html>
                <head>
                    <title>Print QR Stand - ${itemName}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
                        body { font-family: 'Outfit', sans-serif; margin: 0; padding: 20px; display: flex; justify-content: center; background: #f0f0f0; }
                        .stand-card {
                            width: 300px;
                            height: 450px;
                            background: white;
                            border-radius: 20px;
                            overflow: hidden;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            border: 1px solid #ddd;
                        }
                        .header { margin-top: 40px; margin-bottom: 10px; }
                        .logo { font-size: 32px; font-weight: bold; color: #333; }
                        .logo span { color: #dc2626; }
                        .name-badge {
                            background: #22c55e;
                            color: white;
                            padding: 6px 16px;
                            border-radius: 50px;
                            font-weight: 600;
                            font-size: 14px;
                            text-transform: uppercase;
                            margin-bottom: 10px;
                        }
                        .cta { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 20px; }
                        .qr-box {
                            width: 180px;
                            height: 180px;
                            background: white; /* transparent in reality */
                        }
                        .footer-bar {
                            position: absolute;
                            bottom: 30px;
                            width: 80%;
                            height: 6px;
                            background: #22c55e;
                            border-radius: 10px;
                        }
                        /* Print Specifics */
                        @media print {
                            body { background: white; margin: 0; padding: 0; }
                            .stand-card { box-shadow: none; border: 1px dashed #ccc; }
                        }
                    </style>
                </head>
                <body>
                    <div class="stand-card">
                         <div class="header">
                             <div class="logo">NAZ<span>AR</span>A</div>
                         </div>
                         <div class="name-badge">${itemName}</div>
                         <div class="cta">Scan To View 3D</div>
                         <div class="qr-box">
                             ${document.getElementById('qr-code-svg')?.outerHTML}
                         </div>
                         <div class="footer-bar"></div>
                    </div>
                    <script>
                        window.onload = () => { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `)
            win.document.close()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Printable QR Stand</DialogTitle>
                    <DialogDescription>
                        Preview of the table stand card for <b>{itemName}</b>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-4">

                    {/* Preview of the Stand */}
                    <div ref={printRef} className="shrink-0">
                        <div className="w-[240px] h-[360px] bg-white rounded-[20px] shadow-2xl border flex flex-col items-center relative overflow-hidden select-none">
                            {/* Logo Area */}
                            <div className="mt-8 mb-2">
                                <h1 className="text-2xl font-bold tracking-wider text-gray-800">
                                    NAZ<span className="text-primary">AR</span>A
                                </h1>
                            </div>

                            {/* Item Badge */}
                            <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                                {itemName}
                            </div>

                            <div className="text-sm font-semibold text-gray-700 mb-6">
                                Scan To View 3D
                            </div>

                            {/* QR */}
                            <div className="bg-white p-2">
                                <QRCode
                                    id="qr-code-svg"
                                    value={viewUrl}
                                    size={140}
                                    level="H"
                                />
                            </div>

                            {/* Footer Stripe */}
                            <div className="absolute bottom-6 w-3/4 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 w-full">
                        <Button onClick={handlePrint} className="w-full h-12 text-lg" size="lg">
                            <Printer className="mr-2 h-5 w-5" /> Print Stand
                        </Button>
                        <p className="text-xs text-center text-gray-400">
                            Use thick cardstock paper for best results.
                        </p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
