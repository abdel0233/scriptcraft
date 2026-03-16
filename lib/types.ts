export type Locale = "en" | "fr" | "ar";

export interface FormPayload {
    productName: string;
    clientEmail: string;
    productDefinition: string;
    requiredLanguage: string[];
    targetAudience: string[];
    scriptCount: string;
    scriptIdea: string;
    platform: string;
    duration: string;
    hookStyle: string;
    cta: string;
    competitors: string;
    source: "ScriptCraft Portal";
    submittedAt: string;
}

export interface Language {
    value: string;       // Arabic value sent in payload (never changes)
    label: string;       // Primary display label
    subLabel: string;    // Secondary display label
}

export const LANGUAGES: Language[] = [
    { value: "دارجة", label: "دارجة", subLabel: "Moroccan Darija" },
    { value: "فرنسية", label: "Français", subLabel: "French" },
    { value: "الانجليزية", label: "English", subLabel: "English" },
    { value: "العربية الفصحى", label: "العربية", subLabel: "Modern Standard Arabic" },
    { value: "إسبانية", label: "Español", subLabel: "Spanish" },
    { value: "ألمانية", label: "Deutsch", subLabel: "German" },
];

export const AUDIENCE_OPTIONS = [
    {
        value: "نساء جيل Z (18-25)",
        labelKey: "audience_genz",
    },
    {
        value: "أمهات (+35)",
        labelKey: "audience_mothers",
    },
    {
        value: "عشاق الجمال والبشرة",
        labelKey: "audience_beauty",
    },
    {
        value: "جمهور المنتجات الراقية",
        labelKey: "audience_premium",
    },
    {
        value: "رجال (25-40)",
        labelKey: "audience_men",
    },
    {
        value: "مراهقات (15-20)",
        labelKey: "audience_teens",
    },
];

export const PLATFORM_OPTIONS = [
    { value: "TikTok", labelKey: "platform_tiktok" },
    { value: "Instagram", labelKey: "platform_instagram" },
    { value: "YouTube", labelKey: "platform_youtube" },
    { value: "Facebook", labelKey: "platform_facebook" },
];

export const DURATION_OPTIONS = [
    { value: "15", labelKey: "15s" },
    { value: "30", labelKey: "30s" },
    { value: "45", labelKey: "45s" },
    { value: "60", labelKey: "60s" },
];

export const HOOK_OPTIONS = [
    { value: "pain_point", labelKey: "hook_pain" },
    { value: "question", labelKey: "hook_question" },
    { value: "story", labelKey: "hook_story" },
    { value: "shocking_stat", labelKey: "hook_shocking" },
    { value: "transformation", labelKey: "hook_transformation" },
];
