'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Upload, X, FileBox, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { SideNav } from '@/components/admin/SideNav'
import Link from 'next/link'

export default function AddItemPage() {
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Form State
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const router = useRouter()

    // Dropzone Logic
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.[0]) {
            setFile(acceptedFiles[0])
            toast.success("Model selected ready for upload")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'model/gltf-binary': ['.glb'] },
        maxFiles: 1,
        multiple: false
    })

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile(null)
    }

    const isFormValid = name && price && restaurantName && file

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) return

        setLoading(true)
        setUploadProgress(10)

        try {
            // 1. Upload 3D Model
            const fileExt = file!.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            setUploadProgress(40)

            const { error: uploadError } = await supabase.storage
                .from('models')
                .upload(filePath, file!)

            if (uploadError) throw uploadError

            setUploadProgress(70)

            const { data: { publicUrl } } = supabase.storage
                .from('models')
                .getPublicUrl(filePath)

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('menu_items')
                .insert({
                    name,
                    description,
                    price: parseFloat(price),
                    model_url: publicUrl,
                    restaurant_name: restaurantName || 'Uncategorized'
                })

            if (dbError) throw dbError

            setUploadProgress(100)
            toast.success('Item added successfully!')

            // Redirect back to dashboard
            setTimeout(() => {
                router.push('/admin/dashboard')
                router.refresh()
            }, 500)

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Failed to upload item')
            setUploadProgress(0)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <SideNav />
            {/* Main Content Area - Full view height minus padding */}
            <div className="flex-1 md:ml-64 p-4 md:p-6 h-screen flex flex-col box-border">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Item</h1>
                    </div>
                </div>

                {/* Full Screen Split Panel */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row relative">

                    {/* Left Column: Immersive Dropzone */}
                    <div className="lg:w-[45%] bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col relative group transition-colors hover:bg-gray-50">
                        <div className="mb-4 flex items-center justify-between">
                            <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" /> 3D Asset
                            </Label>
                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border">.glb only</span>
                        </div>

                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex-1 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden",
                                isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-gray-200 hover:border-primary/50 hover:bg-white hover:shadow-sm",
                                file ? "bg-white border-green-500/20" : ""
                            )}
                        >
                            <Input {...getInputProps()} />

                            {file ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 z-10 p-8">
                                    <div className="bg-green-100 p-6 rounded-full mb-6 shadow-sm">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-800 mb-1">{file.name}</p>
                                    <p className="text-sm font-medium text-green-600 mb-6 bg-green-50 px-3 py-1 rounded-full">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB Ready
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-100 rounded-full px-6"
                                        onClick={removeFile}
                                    >
                                        <X className="h-4 w-4 mr-2" /> Change Model
                                    </Button>
                                </div>
                            ) : (
                                <div className="z-10 p-8">
                                    <div className="bg-white p-6 rounded-full mb-6 shadow-sm inline-block group-hover:scale-110 transition-transform duration-300">
                                        <Upload className={cn("h-10 w-10 text-gray-400 group-hover:text-primary transition-colors", isDragActive && "text-primary")} />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-700 mb-2">
                                        {isDragActive ? "Drop to upload!" : "Drag & Drop Model"}
                                    </p>
                                    <p className="text-base text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                                        Upload your .glb file here to see it in AR.
                                    </p>
                                </div>
                            )}

                            {/* Decorative Background Pattern */}
                            {!file && (
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Column: Form Inputs */}
                    <div className="lg:w-[55%] p-8 overflow-y-auto bg-white flex flex-col">
                        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Item Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Signature Burger"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-gray-700">Price (PKR)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={e => setPrice(e.target.value)}
                                                className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <Label htmlFor="restaurant" className="text-gray-700">Restaurant / Branch</Label>
                                        <div className="relative">
                                            <FileBox className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="restaurant"
                                                className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                                placeholder="e.g. Main Branch"
                                                value={restaurantName}
                                                onChange={e => setRestaurantName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-gray-700">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Tell customers about this item..."
                                            className="resize-none h-32 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all p-4"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <Button type="button" variant="ghost" onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className={cn(
                                            "min-w-[180px] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]",
                                            !isFormValid ? "opacity-50 cursor-not-allowed" : "bg-gray-900 text-white"
                                        )}
                                        disabled={!isFormValid || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Creating...'}
                                            </>
                                        ) : (
                                            'Create Item'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
