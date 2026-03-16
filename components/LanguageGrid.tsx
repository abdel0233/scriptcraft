"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { LANGUAGES } from "@/lib/types";

interface LanguageGridProps {
    selected: string[];
    onChange: (langs: string[]) => void;
    error?: string;
}

export default function LanguageGrid({ selected, onChange, error }: LanguageGridProps) {
    const { t, locale } = useTranslation();

    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const getOrder = (value: string) => selected.indexOf(value) + 1;

    const isRTL = locale === "ar";

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                {LANGUAGES.map((lang) => {
                    const isSelected = selected.includes(lang.value);
                    const order = isSelected ? getOrder(lang.value) : null;

                    return (
                        <button
                            key={lang.value}
                            type="button"
                            onClick={() => toggle(lang.value)}
                            className={`relative rounded-xl border p-4 text-center transition-all duration-150 ease-out
                ${isSelected
                                    ? "border-[#C9A84C] bg-[#C9A84C]/5 scale-[1.02]"
                                    : "border-white/10 bg-[#111] hover:border-white/25 hover:scale-[1.01]"
                                }`}
                        >
                            {/* Order badge */}
                            {isSelected && (
                                <span className="absolute -top-2.5 -end-2.5 w-5 h-5 rounded-full bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold flex items-center justify-center animate-in zoom-in-50 duration-150">
                                    {order}
                                </span>
                            )}
                            <div className={`font-bold text-sm leading-tight mb-1 ${isSelected ? "text-[#C9A84C]" : "text-white"}`}>
                                {lang.label}
                            </div>
                            <div className="text-[#888] text-xs">{lang.subLabel}</div>
                        </button>
                    );
                })}
            </div>

            {/* Script order bar */}
            {selected.length > 0 && (
                <div
                    className={`flex flex-wrap gap-2 items-center p-3 rounded-lg bg-[#111] border border-white/5 ${isRTL ? "flex-row-reverse" : ""
                        }`}
                >
                    <span className="text-xs text-[#888] uppercase tracking-widest shrink-0">
                        {t("label_script_order")}:
                    </span>
                    <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {selected.map((val, idx) => {
                            const lang = LANGUAGES.find((l) => l.value === val);
                            return (
                                <div
                                    key={val}
                                    className="flex items-center gap-1.5 text-xs animate-in fade-in slide-in-from-bottom-1 duration-200"
                                >
                                    <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] font-bold flex items-center justify-center text-[10px]">
                                        {idx + 1}
                                    </span>
                                    <span className="text-white/70">{lang?.label ?? val}</span>
                                    {idx < selected.length - 1 && (
                                        <span className="text-[#444]">{isRTL ? "←" : "→"}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}
