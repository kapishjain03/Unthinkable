"use client";

/**
 * UploadHistory Component
 *
 * Displays the last 5 upload results stored in localStorage.
 * Allows users to re-view previous analysis results.
 */

import { Clock, FileText, Image, Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/types";

interface UploadHistoryProps {
    history: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    onClear: () => void;
}

export default function UploadHistory({ history, onSelect, onClear }: UploadHistoryProps) {
    if (history.length === 0) return null;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gray-100 dark:bg-gray-700/50 p-2">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                        Recent Uploads
                    </h3>
                </div>
                <button
                    onClick={onClear}
                    className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                    title="Clear history"
                >
                    <Trash2 className="h-3 w-3" />
                    Clear
                </button>
            </div>

            <div className="space-y-2">
                {history.map((entry) => {
                    const isImage = entry.fileType.startsWith("image/");
                    const Icon = isImage ? Image : FileText;
                    const timeAgo = getTimeAgo(entry.timestamp);

                    return (
                        <button
                            key={entry.id}
                            onClick={() => onSelect(entry)}
                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                        >
                            <Icon className="h-4 w-4 text-gray-400 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {entry.filename}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Score: {entry.analysis.engagement_score} • {timeAgo}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Helper to create human-readable relative time strings */
function getTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
