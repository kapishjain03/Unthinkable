"use client";

/**
 * ExtractedText Component
 *
 * Collapsible section displaying the raw text extracted from the uploaded document.
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Copy, Check } from "lucide-react";

interface ExtractedTextProps {
    text: string;
    filename: string;
}

export default function ExtractedText({ text, filename }: ExtractedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="animate-slide-up rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden shadow-sm">
            {/* Header — always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-brand-50 dark:bg-brand-900/20 p-2">
                        <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            Extracted Text
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {filename} • {wordCount} words • {charCount.toLocaleString()} characters
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Copy button */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-all cursor-pointer"
                        title="Copy extracted text"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </div>
                    {/* Expand/collapse */}
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </button>

            {/* Expandable content */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-96" : "max-h-0"
                    }`}
            >
                <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed max-h-72 overflow-y-auto custom-scrollbar">
                        {text}
                    </pre>
                </div>
            </div>
        </div>
    );
}
