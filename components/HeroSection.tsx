"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <div className="text-center rtl:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="text-[11px] font-medium text-[#C9A84C] uppercase tracking-widest">
                    AI-Powered UGC
                </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold font-syne hero-title mb-5 leading-none tracking-tight">
                {t("hero_title")}
            </h1>

            <p className="text-lg text-[#888] max-w-xl mx-auto leading-relaxed rtl:mx-0">
                {t("hero_subtitle")}
            </p>

            {/* Decorative line */}
            <div className="mt-8 flex items-center justify-center gap-3 rtl:flex-row-reverse">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
                <div className="w-1 h-1 rounded-full bg-[#C9A84C]/60" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
            </div>
        </div>
    );
}
