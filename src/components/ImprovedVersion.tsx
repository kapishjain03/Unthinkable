"use client";

/**
 * ImprovedVersion Component
 *
 * Displays the AI-improved version of the social media content
 * with a copy-to-clipboard button.
 */

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

interface ImprovedVersionProps {
    text: string;
}

export default function ImprovedVersion({ text }: ImprovedVersionProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!text) return null;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2">
                        <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        Improved Version
                    </h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800/30 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy to clipboard
                        </>
                    )}
                </button>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-gray-50 to-brand-50/30 dark:from-gray-900/50 dark:to-brand-900/10 border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {text}
                </p>
            </div>
        </div>
    );
}
