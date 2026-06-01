import React from "react";
import ScriptForm from "@/components/ScriptForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid noise-overlay relative">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between rtl:flex-row-reverse">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Flowmark Logo" className="w-7 h-7 object-contain" />
            <span className="hidden sm:inline-block text-lg font-bold font-syne tracking-tight hero-title">
              Flowmark Script writer
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 pb-24">
        <HeroSection />
        <div className="mt-12">
          <React.Suspense fallback={
            <div className="flex justify-center items-center py-20 text-white">
              <svg className="animate-spin w-8 h-8 text-[#BAE600]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          }>
            <ScriptForm />
          </React.Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-[#444] text-xs">
        Flowmark Script writer — Powered by AI
      </footer>
    </div>
  );
}
