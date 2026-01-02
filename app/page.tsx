'use client'
// Re-triggering deployment for NazARa 2.0 Landing Page


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Box, Star, Menu } from "lucide-react";
import { useState, useEffect } from 'react';
import TrueFocus from "@/components/TrueFocus";
import ShinyText from "@/components/ShinyText";
import GlareHover from "@/components/GlareHover";
import Beams from "@/components/Beams";

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

      {/* Beams Background - Full Screen */}
      <div className="fixed inset-0 z-0 pointer-events-none h-screen opacity-60">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#6D28D9"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={45}
        />
        {/* Gradient fade at bottom of beams to blend with dark bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1A23]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        {/* Navbar */}
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
          <nav className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 w-full max-w-4xl bg-[#1A1A23]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg ring-1 ring-white/5 animate-in fade-in slide-in-from-top-4 duration-700">

            {/* Left: Menu Icon */}
            <div className="flex items-center justify-start flex-1 text-white hover:text-indigo-400 cursor-pointer transition-colors">
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            {/* Center: Brand (Logo + Text) */}
            <div className="flex items-center justify-center flex-1">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 fill-indigo-500" />
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  NAZ<span className="text-indigo-500">AR</span>A
                </span>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="flex items-center justify-end flex-1">
              <Link href="/admin/login">
                <Button className="h-8 px-4 sm:h-9 sm:px-6 rounded-lg bg-[#6C5DD3] hover:bg-[#5b4ec2] text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-indigo-500/20">
                  Get Started
                </Button>
              </Link>
            </div>

          </nav>
        </div>

        {/* Hero Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-20">

          {/* Blur Text Animation */}
          <div className="mb-8 pb-4">
            <TrueFocus
              sentence="Dining Augmented"
              manualMode={false}
              blurAmount={10}
              borderColor="#6C5DD3"
              animationDuration={isMobile ? 0.5 : 0.3}
              pauseBetweenAnimations={isMobile ? 1 : 0.6}
              loop={false}
            />
          </div>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed tracking-wide font-[family-name:var(--font-geist-sans)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            Transform your restaurant's menu into an immersive 3D experience.
            Let customers <span className="text-white font-medium">Scan</span>, <span className="text-white font-medium">View</span>, and <span className="text-white font-medium">Taste</span> the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 relative z-20 items-center justify-center">

            {/* Get Started Button - Sleek & Sized */}
            <Link href="/admin/login">
              <Button className="h-12 px-8 sm:h-14 sm:px-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium text-base sm:text-lg shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 group border-0 min-w-[180px] sm:min-w-[200px]">
                <ShinyText
                  text="Get Started"
                  disabled={false}
                  speed={3}
                  className="font-bold tracking-wide"
                  color="#ffffff"
                  shineColor="#b0b0b0"
                />
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Learn More Button - Dark Blurred */}
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="h-12 px-8 sm:h-14 sm:px-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-medium text-base sm:text-lg transition-all hover:scale-105 active:scale-95 min-w-[180px] sm:min-w-[200px] flex items-center justify-center"
            >
              Learn More
            </button>

          </div>
        </div>

      </div>

      {/* Feature Grid - Below Fold / Bottom */}
      <section id="features" className="relative z-10 w-full bg-black/20 backdrop-blur-xl border-t border-white/5 py-12 sm:py-20 scroll-mt-20 min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
          {/* Card 1 */}
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.15}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            width="100%"
            height="100%"
            background="rgba(255, 255, 255, 0.05)"
            borderColor="rgba(255, 255, 255, 0.05)"
            borderRadius="1.5rem"
            disabled={isMobile}
          >
            <div className="p-8 h-full flex flex-col items-start transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Box className="text-indigo-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">3D Menu Items</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Upload high-fidelity GLB models. Give customers a 360° view of your culinary masterpieces before they order.</p>
            </div>
          </GlareHover>

          {/* Card 2 */}
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.15}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            width="100%"
            height="100%"
            background="rgba(255, 255, 255, 0.05)"
            borderColor="rgba(255, 255, 255, 0.05)"
            borderRadius="1.5rem"
          >
            <div className="p-8 h-full flex flex-col items-start transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="text-purple-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">App-Less AR</h3>
              <p className="text-gray-400 text-sm leading-relaxed">No app download required. Built on cutting-edge WebAR technology that works directly in the browser.</p>
            </div>
          </GlareHover>

          {/* Card 3 */}
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.15}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            width="100%"
            height="100%"
            background="rgba(255, 255, 255, 0.05)"
            borderColor="rgba(255, 255, 255, 0.05)"
            borderRadius="1.5rem"
          >
            <div className="p-8 h-full flex flex-col items-start transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-pink-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Boost Engagement</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Visual menus increase appetite and check sizes. Turn dining into a shareable social experience.</p>
            </div>
          </GlareHover>
        </div>
      </section>

      {/* About & Contact Section */}
      <section id="contact" className="relative z-10 w-full bg-[#15151e] border-t border-white/5 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row gap-8 md:gap-12">

          {/* About Us */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">About Us</h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              NazARa is pioneering the future of dining by bridging the gap between physical menus and digital experiences. We believe that food should be experienced before it's even ordered. Our mission is to empower restaurants with cutting-edge AR technology that is accessible, app-less, and incredibly engaging.
            </p>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Founded by a team of passionate developers and foodies, we are dedicated to transforming how the world eats, one 3D model at a time.
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex-1 space-y-6 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">Contact Us</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Ready to transform your menu? Get in touch with our team for a demo or custom integration.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
                <span>hello@nazara.tech</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <span>+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
