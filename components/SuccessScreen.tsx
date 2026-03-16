"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LANGUAGES } from "@/lib/types";
import { CheckCircle } from "lucide-react";

interface SuccessData {
    clientEmail: string;
    requiredLanguage: string[];
    scriptCount: number;
}

export default function SuccessScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [data, setData] = useState<SuccessData | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("scriptcraft_success");
        if (raw) {
            setData(JSON.parse(raw));
        }
    }, []);

    const getLanguageLabel = (value: string) => {
        return LANGUAGES.find((l) => l.value === value)?.label ?? value;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#0A0A0A]">
            <div className="max-w-lg w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#C9A84C]" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-3 font-syne">
                    {t("success_title")}
                </h1>

                {data && (
                    <>
                        <p className="text-[#888] mb-2">
                            <span className="text-[#C9A84C] font-semibold">{data.scriptCount}</span>{" "}
                            {t("success_body")}{" "}
                            <span className="text-white">
                                {data.requiredLanguage.map(getLanguageLabel).join(", ")}
                            </span>
                        </p>
                        <p className="text-[#888] mb-8">
                            {t("success_email")}{" "}
                            <span className="text-[#C9A84C] font-medium">{data.clientEmail}</span>
                        </p>
                    </>
                )}

                {/* Animated dots */}
                <div className="flex justify-center gap-1.5 mb-8">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#C9A84C]/60"
                            style={{
                                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={() => {
                        sessionStorage.removeItem("scriptcraft_success");
                        router.push("/");
                    }}
                    className="px-8 py-3 rounded-xl border border-[#C9A84C]/40 text-[#C9A84C] font-medium text-sm hover:bg-[#C9A84C]/10 transition-all duration-150"
                >
                    {t("success_cta")}
                </button>
            </div>
        </div>
    );
}
