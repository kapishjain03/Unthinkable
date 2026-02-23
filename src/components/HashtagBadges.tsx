"use client";

/**
 * HashtagBadges Component
 *
 * Displays suggested hashtags as clickable/copyable badges.
 */

import { useState } from "react";
import { Hash, Copy, Check } from "lucide-react";

interface HashtagBadgesProps {
    hashtags: string[];
}

export default function HashtagBadges({ hashtags }: HashtagBadgesProps) {
    const [copiedAll, setCopiedAll] = useState(false);

    const handleCopyAll = async () => {
        const text = hashtags.join(" ");
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
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    if (!hashtags || hashtags.length === 0) return null;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-2">
                        <Hash className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        Suggested Hashtags
                    </h3>
                </div>
                <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                    {copiedAll ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy all
                        </>
                    )}
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-50 to-violet-50 dark:from-brand-900/20 dark:to-violet-900/20 border border-brand-200 dark:border-brand-700/50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 hover:shadow-sm hover:scale-105 transition-all cursor-default"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
