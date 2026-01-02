'use client'
// Re-triggering deployment for NazARa 2.0 Landing Page


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Box, Star } from "lucide-react";
import { useState, useEffect } from 'react';
import TrueFocus from "@/components/TrueFocus";
import ShinyText from "@/components/ShinyText";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize coordinates -1 to 1
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#1A1A23] text-white overflow-hidden relative selection:bg-indigo-500/30 font-sans"
      onMouseMove={handleMouseMove}
    >

      {/* Background Gradients (Interactive Parallax) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-float transition-transform duration-75 ease-out"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-float-delayed transition-transform duration-75 ease-out"
          style={{ transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="text-2xl font-bold tracking-tighter">
            NAZ<span className="text-indigo-500">AR</span>A
          </div>
          <Link href="/admin/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 transition-all">
              Admin Portal
            </Button>
          </Link>
        </nav>

        {/* Hero Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-20">

          {/* Blur Text Animation */}
          <div className="mb-8 pb-4">
            <TrueFocus
              sentence="Dining Augmented"
              manualMode={false}
              blurAmount={10}
              borderColor="#6C5DD3"
              animationDuration={0.3}
              pauseBetweenAnimations={0.6}
              loop={isMobile}
            />
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            Transform your restaurant's menu into an immersive 3D experience.
            Let customers <span className="text-white font-medium">Scan</span>, <span className="text-white font-medium">View</span>, and <span className="text-white font-medium">Taste</span> the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 relative z-20">
            <Link href="/admin/login">
              <Button className="h-16 px-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium text-lg shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 group border-0">
                <ShinyText
                  text="Get Started"
                  disabled={false}
                  speed={3}
                  className="font-bold tracking-wide"
                  color="#ffffff"
                  shineColor="#b0b0b0"
                />
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Feature Grid - Below Fold / Bottom */}
      <section className="relative z-10 w-full bg-black/20 backdrop-blur-xl border-t border-white/5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 shadow-sm hover:shadow-md hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 group text-left hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Box className="text-indigo-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">3D Menu Items</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Upload high-fidelity GLB models. Give customers a 360° view of your culinary masterpieces before they order.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 shadow-sm hover:shadow-md hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group text-left hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="text-purple-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">App-Less AR</h3>
            <p className="text-gray-400 text-sm leading-relaxed">No app download required. Built on cutting-edge WebAR technology that works directly in the browser.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 shadow-sm hover:shadow-md hover:border-pink-500/30 hover:bg-white/10 transition-all duration-300 group text-left backdrop-blur-sm hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star className="text-pink-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Boost Engagement</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Visual menus increase appetite and check sizes. Turn dining into a shareable social experience.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
