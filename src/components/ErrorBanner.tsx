"use client";

/**
 * ErrorBanner Component
 *
 * Displays error messages with a dismiss button and retry action.
 */

import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface ErrorBannerProps {
    message: string;
    onDismiss: () => void;
    onRetry?: () => void;
}

export default function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
    return (
        <div className="animate-slide-up rounded-xl border border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="rounded-lg bg-red-100 dark:bg-red-800/30 p-2 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Something went wrong
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-0.5 break-words">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                            title="Retry"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onDismiss}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                        title="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
