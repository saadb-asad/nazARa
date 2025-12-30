'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff, CheckSquare } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#1A1A23] text-white overflow-hidden font-sans">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop")', // Abstract dark purple/dune style 
          }}
        >
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-1">
            NAZARA
          </h1>
          <Link href="/" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-sm font-medium transition-colors">
            Back to website →
          </Link>
        </div>

        {/* Bottom Text - The "Pre-existing text" */}
        <div className="relative z-10 mt-auto max-w-lg">
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Capturing Moments,<br />Creating Memories
          </h2>
          <div className="flex gap-2 mt-8">
            <div className="w-12 h-1 bg-white rounded-full opacity-100" />
            <div className="w-12 h-1 bg-white rounded-full opacity-30" />
            <div className="w-12 h-1 bg-white rounded-full opacity-30" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Dark Theme) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#1A1A23]">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-white mb-2">Login to account</h2>
            <p className="text-gray-400">
              Already have an account? <span className="text-indigo-400 cursor-pointer hover:underline">Log in</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 font-normal">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-[#23232F] border-transparent text-white placeholder:text-gray-600 rounded-lg focus-visible:ring-indigo-500 focus-visible:bg-[#2A2A35] transition-all"
                placeholder="name@company.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-400 font-normal">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 bg-[#23232F] border-transparent text-white placeholder:text-gray-600 rounded-lg focus-visible:ring-indigo-500 focus-visible:bg-[#2A2A35] transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-white text-black">
                <CheckSquare size={14} className="opacity-100" />
              </div>
              <span className="text-sm text-gray-400">I agree to the <span className="underline cursor-pointer hover:text-white">Terms & Conditions</span></span>
            </div>

            {error && (
              <div className="text-sm text-red-400 font-medium bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-medium bg-[#6C5DD3] hover:bg-[#5c4ec0] text-white rounded-xl shadow-lg shadow-indigo-900/20 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                'Login'
              )}
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or login with</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="h-12 bg-[#23232F] border-transparent hover:bg-[#2A2A35] text-white hover:text-white">
                Google
              </Button>
              <Button variant="outline" type="button" className="h-12 bg-[#23232F] border-transparent hover:bg-[#2A2A35] text-white hover:text-white">
                Apple
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
