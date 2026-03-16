import ScriptForm from "@/components/ScriptForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid noise-overlay relative">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between rtl:flex-row-reverse">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-syne tracking-tight hero-title">
              ScriptCraft
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 pb-24">
        <HeroSection />
        <div className="mt-12">
          <ScriptForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-[#444] text-xs">
        ScriptCraft — Powered by AI
      </footer>
    </div>
  );
}
