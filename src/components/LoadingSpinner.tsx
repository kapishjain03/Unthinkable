"use client";

/**
 * LoadingSpinner Component
 *
 * Displays a multi-stage loading indicator that shows
 * the current processing stage with animated transitions.
 */

import { FileSearch, Brain, Sparkles, Loader2 } from "lucide-react";
import type { AppStage } from "@/types";

interface LoadingSpinnerProps {
    stage: AppStage;
}

const STAGE_CONFIG: Record<string, { icon: typeof Loader2; label: string; sublabel: string; color: string }> = {
    uploading: {
        icon: Loader2,
        label: "Uploading file",
        sublabel: "Sending your document to the server...",
        color: "text-brand-500",
    },
    extracting: {
        icon: FileSearch,
        label: "Extracting text",
        sublabel: "Reading content from your document...",
        color: "text-emerald-500",
    },
    analyzing: {
        icon: Brain,
        label: "Analyzing content",
        sublabel: "AI is evaluating engagement potential...",
        color: "text-purple-500",
    },
};

export default function LoadingSpinner({ stage }: LoadingSpinnerProps) {
    const config = STAGE_CONFIG[stage];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
            {/* Animated spinner container */}
            <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-brand-500 border-r-brand-400 animate-spin" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className={`h-7 w-7 ${config.color} ${stage === "uploading" ? "animate-spin" : "animate-pulse"}`} />
                </div>
            </div>

            {/* Labels */}
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    {config.label}
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {config.sublabel}
                </p>
            </div>

            {/* Dots progress */}
            <div className="flex items-center gap-3">
                {Object.keys(STAGE_CONFIG).map((key, idx) => {
                    const stageKeys = Object.keys(STAGE_CONFIG);
                    const currentIdx = stageKeys.indexOf(stage);
                    const isActive = idx <= currentIdx;

                    return (
                        <div key={key} className="flex items-center gap-3">
                            <div
                                className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${isActive
                                        ? idx === currentIdx
                                            ? "bg-brand-500 scale-125 animate-pulse-slow"
                                            : "bg-brand-400"
                                        : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            />
                            {idx < stageKeys.length - 1 && (
                                <div
                                    className={`h-0.5 w-6 rounded transition-all duration-500 ${idx < currentIdx ? "bg-brand-400" : "bg-gray-300 dark:bg-gray-600"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
