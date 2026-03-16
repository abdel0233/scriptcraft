"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Locale } from "@/lib/i18n/useTranslation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

const LANGUAGES: { code: Locale; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "fr", label: "Français", native: "Français" },
    { code: "ar", label: "العربية", native: "العربية" },
];

export default function LanguageSwitcher() {
    const { locale, setLocale } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div
            ref={ref}
            className="relative z-50"
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#111] hover:border-[#C9A84C]/50 transition-all duration-150 text-sm text-white/80 hover:text-white"
                aria-label="Switch language"
            >
                <Globe size={14} className="text-[#C9A84C]" />
                <span className="font-medium">{current.native}</span>
                <svg
                    className={`w-3 h-3 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full mt-1 end-0 min-w-[140px] bg-[#111] border border-white/10 rounded-lg overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLocale(lang.code);
                                setOpen(false);
                            }}
                            className={`w-full text-start px-4 py-2.5 text-sm transition-colors duration-100
                ${locale === lang.code
                                    ? "text-[#C9A84C] bg-[#C9A84C]/10"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {lang.native}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
