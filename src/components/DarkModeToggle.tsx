"use client";

/**
 * DarkModeToggle Component
 *
 * Toggles between light and dark mode, persisting the preference.
 */

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize from system preference or localStorage
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggle = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Prevent hydration mismatch
    if (!mounted) return <div className="h-9 w-9" />;

    return (
        <button
            onClick={toggle}
            className="relative rounded-xl p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
        >
            {isDark ? (
                <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <Moon className="h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    );
}
