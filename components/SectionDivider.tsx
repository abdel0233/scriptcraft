"use client";

interface SectionDividerProps {
    label: string;
}

export default function SectionDivider({ label }: SectionDividerProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#555] whitespace-nowrap rtl:tracking-normal">
                {label}
            </span>
            <div className="flex-1 h-px bg-white/5" />
        </div>
    );
}
