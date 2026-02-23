"use client";

/**
 * Header Component
 *
 * App header with branding and dark mode toggle.
 */

import DarkModeToggle from "./DarkModeToggle";
import { BarChart3 } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 glass">
            <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="relative rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 p-2.5 shadow-xl shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                            CONTENT<span className="text-brand-600 dark:text-brand-400">ANALYZER</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.2em] hidden sm:block">
                            Intelligent Strategy Engine
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <DarkModeToggle />
                </div>
            </div>
        </header>
    );
}
