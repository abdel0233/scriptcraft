"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { AUDIENCE_OPTIONS } from "@/lib/types";

interface AudienceChipsProps {
    selected: string[];
    onChange: (vals: string[]) => void;
    error?: string;
}

export default function AudienceChips({ selected, onChange, error }: AudienceChipsProps) {
    const { t } = useTranslation();

    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 rtl:flex-row-reverse">
                {AUDIENCE_OPTIONS.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggle(opt.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-out
                ${isSelected
                                    ? "bg-[#C9A84C] text-[#0A0A0A] scale-105 shadow-[0_0_12px_rgba(201,168,76,0.35)]"
                                    : "border border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-white hover:scale-102"
                                }`}
                        >
                            {t(opt.labelKey)}
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="text-red-400 text-sm">{error}</p>
            )}
        </div>
    );
}
