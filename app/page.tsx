'use client'
// Re-triggering deployment for NazARa 2.0 Landing Page


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Box, Star } from "lucide-react";
import { useState, useEffect } from 'react';
import TrueFocus from "@/components/TrueFocus";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize coordinates -1 to 1
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

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

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-2xl font-bold tracking-tighter">
          NAZ<span className="text-indigo-500">AR</span>A
        </div>
        <Link href="/admin/login">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 transition-all">
            Admin Portal
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-8 animate-in fade-in zoom-in duration-700 delay-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 is Live
        </div>

        {/* Blur Text Animation */}
        <div className="mb-6 pb-2">
          <TrueFocus
            sentence="Dining Augmented"
            manualMode={false}
            blurAmount={10}
            borderColor="#6C5DD3"
            animationDuration={0.4}
            pauseBetweenAnimations={0.5}
          />
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          Transform your restaurant's menu into an immersive 3D experience.
          Let customers <span className="text-white font-medium">Scan</span>, <span className="text-white font-medium">View</span>, and <span className="text-white font-medium">Taste</span> the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <Link href="/admin/login">
            <Button className="h-14 px-8 rounded-full bg-[#6C5DD3] hover:bg-[#5c4ec0] text-white font-medium text-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 group">
              Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid / Visual */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 group text-left backdrop-blur-sm hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Box className="text-indigo-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">3D Menu Items</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Upload high-fidelity GLB models. Give customers a 360° view of your culinary masterpieces before they order.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group text-left backdrop-blur-sm hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="text-purple-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">App-Less AR</h3>
            <p className="text-gray-400 text-sm leading-relaxed">No app download required. Built on cutting-edge WebAR technology that works directly in the browser.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-pink-500/30 hover:bg-white/10 transition-all duration-300 group text-left backdrop-blur-sm hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star className="text-pink-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Boost Engagement</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Visual menus increase appetite and check sizes. Turn dining into a shareable social experience.</p>
          </div>
        </div>

      </main>

    </div>
  );
}
