"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
    PLATFORM_OPTIONS,
    DURATION_OPTIONS,
    HOOK_OPTIONS,
    type FormPayload,
} from "@/lib/types";
import { submitBrief } from "@/lib/submitBrief";
import LanguageGrid from "./LanguageGrid";
import AudienceChips from "./AudienceChips";
import SectionDivider from "./SectionDivider";

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="text-red-400 text-sm mt-1">{msg}</p>;
}

export default function ScriptForm() {
    const { t, locale } = useTranslation();
    const router = useRouter();

    // Fields
    const [productName, setProductName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [productDefinition, setProductDefinition] = useState("");
    const [requiredLanguage, setRequiredLanguage] = useState<string[]>([]);
    const [targetAudience, setTargetAudience] = useState<string[]>([]);
    const [scriptIdea, setScriptIdea] = useState("");
    const [scriptCount, setScriptCount] = useState("1");
    const [platform, setPlatform] = useState<string[]>([]);
    const [duration, setDuration] = useState("");
    const [hookStyle, setHookStyle] = useState("");
    const [cta, setCta] = useState("");
    const [competitors, setCompetitors] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [webhookError, setWebhookError] = useState("");
    const [token, setToken] = useState("");
    const [clientName, setClientName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const tokenVal = searchParams.get("token");
                if (!tokenVal) {
                    setIsTokenValid(false);
                    setIsCheckingToken(false);
                    return;
                }
                setToken(tokenVal);

                const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTWh9SY4OvXb4Bsnyhsj-F9GBgZiUI_7-_JKayGCrJTXuKH2JSHQizA9rYhNY6TVJHaR3fEEaclJhPn/pub?gid=0&single=true&output=csv");
                if (!response.ok) {
                    setIsTokenValid(false);
                    setIsCheckingToken(false);
                    return;
                }
                const csvText = await response.text();
                
                const lines = csvText.split(/\r?\n/);
                if (lines.length < 2) {
                    setIsTokenValid(false);
                    setIsCheckingToken(false);
                    return;
                }
                
                const headers = lines[0].split(',').map(h => h.trim());
                
                let foundRow = null;
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    let cols = [];
                    let inQuotes = false;
                    let val = '';
                    for (let j = 0; j < lines[i].length; j++) {
                        let char = lines[i][j];
                        if (char === '"') {
                            inQuotes = !inQuotes;
                        } else if (char === ',' && !inQuotes) {
                            cols.push(val);
                            val = '';
                        } else {
                            val += char;
                        }
                    }
                    cols.push(val);
                    
                    const obj: Record<string, string> = {};
                    for (let j = 0; j < headers.length; j++) {
                        let value = cols[j] || '';
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.substring(1, value.length - 1).replace(/""/g, '"');
                        }
                        obj[headers[j]] = value;
                    }
                    
                    if (obj['client_id'] === tokenVal) {
                        foundRow = obj;
                        break;
                    }
                }
                
                if (foundRow && foundRow['is_active'] === 'TRUE') {
                    setIsTokenValid(true);
                    setClientEmail(foundRow['client_email'] || "");
                    setProductName(foundRow['brand_name'] || "");
                    setClientName(foundRow['client_name'] || "");
                    setBrandName(foundRow['brand_name'] || "");
                } else {
                    setIsTokenValid(false);
                }
            } catch (err) {
                console.error("Error checking token:", err);
                setIsTokenValid(false);
            } finally {
                setIsCheckingToken(false);
            }
        };
        checkToken();
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!productName.trim()) newErrors.productName = `${t("error_required")} ${t("label_product_name")}`;
        if (!clientEmail.trim()) newErrors.clientEmail = `${t("error_required")} ${t("label_client_email")}`;
        if (!productDefinition.trim()) newErrors.productDefinition = `${t("error_required")} ${t("label_product_definition")}`;
        if (!scriptIdea.trim()) newErrors.scriptIdea = `${t("error_required")} ${t("label_script_idea")}`;
        if (requiredLanguage.length === 0) newErrors.requiredLanguage = t("error_language");
        if (targetAudience.length === 0) newErrors.targetAudience = t("error_audience");
        if (platform.length === 0) newErrors.platform = `${t("error_required")} ${t("label_platform")}`;
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validated = validate();
        if (Object.keys(validated).length > 0) {
            setErrors(validated);
            // Scroll to first error
            setTimeout(() => {
                const firstError = document.querySelector("[data-error]");
                firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
            return;
        }

        setErrors({});
        setWebhookError("");
        setLoading(true);

        const payload: FormPayload = {
            productName,
            clientEmail,
            productDefinition,
            requiredLanguage,
            targetAudience,
            scriptCount,
            scriptIdea,
            platform,
            duration,
            hookStyle,
            cta,
            competitors,
            source: "Flowmark Script writer Portal",
            submittedAt: new Date().toISOString(),
            clientName,
            brandName,
            token,
        };

        try {
            await submitBrief(payload);
            // Store success data for success page
            sessionStorage.setItem(
                "scriptcraft_success",
                JSON.stringify({
                    clientEmail,
                    requiredLanguage,
                    scriptCount: Number(scriptCount),
                })
            );
            router.push("/success");
        } catch {
            setWebhookError(t("error_webhook"));
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#BAE600]/60 focus:ring-1 focus:ring-[#BAE600]/20 transition-all duration-150 text-sm rtl:text-right";
    const selectClass =
        "w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BAE600]/60 focus:ring-1 focus:ring-[#BAE600]/20 transition-all duration-150 text-sm rtl:text-right appearance-none cursor-pointer";
    const labelClass = "block text-sm font-medium text-white/80 mb-2 rtl:text-right";

    if (isCheckingToken) {
        return (
            <div className="flex justify-center items-center py-20 text-white">
                <svg className="animate-spin w-8 h-8 text-[#BAE600]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center bg-[#111] p-8 rounded-xl border border-white/10 max-w-md w-full">
                    <p className="text-white/80 text-lg">
                        This link is no longer active. Please contact us.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-10">
            <input type="hidden" name="token" value={token} />

            {/* Section: Brand & Product */}
            <div>
                <SectionDivider label={t("section_brand")} />
                <div className="space-y-5">
                    <div data-error={errors.productName ? "true" : undefined}>
                        <label className={labelClass}>{t("label_product_name")}</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder={t("placeholder_product_name")}
                            className={`${inputClass} ${errors.productName ? "border-red-500/60" : ""}`}
                        />
                        <FieldError msg={errors.productName} />
                    </div>

                    <div data-error={errors.clientEmail ? "true" : undefined}>
                        <label className={labelClass}>{t("label_client_email")}</label>
                        <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder={t("placeholder_client_email")}
                            dir="ltr"
                            className={`${inputClass} ${errors.clientEmail ? "border-red-500/60" : ""}`}
                        />
                        <FieldError msg={errors.clientEmail} />
                    </div>

                    <div data-error={errors.productDefinition ? "true" : undefined}>
                        <label className={labelClass}>{t("label_product_definition")}</label>
                        <textarea
                            value={productDefinition}
                            onChange={(e) => setProductDefinition(e.target.value)}
                            placeholder={t("placeholder_product_definition")}
                            rows={4}
                            className={`${inputClass} resize-none ${errors.productDefinition ? "border-red-500/60" : ""}`}
                        />
                        <FieldError msg={errors.productDefinition} />
                    </div>
                </div>
            </div>

            {/* Section: Script Languages */}
            <div>
                <SectionDivider label={t("section_languages")} />
                <div data-error={errors.requiredLanguage ? "true" : undefined}>
                    <p className="text-sm text-[#888] mb-4 rtl:text-right">{t("label_languages")}</p>
                    <LanguageGrid
                        selected={requiredLanguage}
                        onChange={setRequiredLanguage}
                        error={errors.requiredLanguage}
                    />
                </div>
            </div>

            {/* Section: Target Audience */}
            <div>
                <SectionDivider label={t("section_audience")} />
                <div data-error={errors.targetAudience ? "true" : undefined}>
                    <label className={labelClass}>{t("label_audience")}</label>
                    <AudienceChips
                        selected={targetAudience}
                        onChange={setTargetAudience}
                        error={errors.targetAudience}
                    />
                </div>
            </div>

            {/* Section: Script Parameters */}
            <div>
                <SectionDivider label={t("section_script")} />
                <div className="space-y-5">
                    <div data-error={errors.scriptIdea ? "true" : undefined}>
                        <label className={labelClass}>{t("label_script_idea")}</label>
                        <textarea
                            value={scriptIdea}
                            onChange={(e) => setScriptIdea(e.target.value)}
                            placeholder={t("placeholder_script_idea")}
                            rows={5}
                            className={`${inputClass} resize-none ${errors.scriptIdea ? "border-red-500/60" : ""}`}
                        />
                        <FieldError msg={errors.scriptIdea} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>{t("label_script_count")}</label>
                            <input
                                type="number"
                                min="1"
                                value={scriptCount}
                                onChange={(e) => setScriptCount(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div data-error={errors.platform ? "true" : undefined}>
                            <label className={labelClass}>{t("label_platform")}</label>
                            <div className="flex flex-wrap gap-2 rtl:flex-row-reverse mt-2">
                                {PLATFORM_OPTIONS.map((o) => {
                                    const isSelected = platform.includes(o.value);
                                    return (
                                        <button
                                            key={o.value}
                                            type="button"
                                            onClick={() => {
                                                if (isSelected) {
                                                    setPlatform(platform.filter(p => p !== o.value));
                                                } else {
                                                    setPlatform([...platform, o.value]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ease-out ${
                                                isSelected
                                                    ? "bg-[#BAE600] text-[#0A0A0A] shadow-[0_0_8px_rgba(201,168,76,0.35)] scale-105"
                                                    : "border border-white/15 text-white/70 hover:border-[#BAE600]/50 hover:text-white"
                                            }`}
                                        >
                                            {t(o.labelKey)}
                                        </button>
                                    );
                                })}
                            </div>
                            <FieldError msg={errors.platform} />
                        </div>

                        <div>
                            <label className={labelClass}>{t("label_duration")}</label>
                            <div className="relative">
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="">{t("duration_select")}</option>
                                    {DURATION_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
                                    <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            {t("label_hook_style")} <span className="text-[#555]">{t("optional")}</span>
                        </label>
                        <div className="relative">
                            <select
                                value={hookStyle}
                                onChange={(e) => setHookStyle(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">{t("hook_any")}</option>
                                {HOOK_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
                                <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            {t("label_cta")} <span className="text-[#555]">{t("optional")}</span>
                        </label>
                        <input
                            type="text"
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            placeholder={t("placeholder_cta")}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Extra Context */}
            <div>
                <SectionDivider label={t("section_extra")} />
                <div>
                    <label className={labelClass}>
                        {t("label_competitors")} <span className="text-[#555]">{t("optional")}</span>
                    </label>
                    <input
                        type="text"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        placeholder={t("placeholder_competitors")}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Webhook Error */}
            {webhookError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm rtl:text-right">
                    {webhookError}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#BAE600] text-[#0A0A0A] font-bold text-base tracking-wide hover:bg-[#d4b35a] active:scale-[0.99] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t("btn_loading")}
                    </>
                ) : (
                    t("btn_submit")
                )}
            </button>
        </form>
    );
}
