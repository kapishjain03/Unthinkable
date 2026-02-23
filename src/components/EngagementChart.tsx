"use client";

/**
 * EngagementChart Component
 *
 * Circular progress ring showing the engagement score
 * with animated fill and color-coded score ranges.
 */

import { getScoreColor, getScoreLabel } from "@/lib/utils";
import { useEffect, useState } from "react";

interface EngagementChartProps {
    score: number;
}

export default function EngagementChart({ score }: EngagementChartProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    // Animate score count up
    useEffect(() => {
        const duration = 1500;
        const start = Date.now();
        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    // SVG circle calculations
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* SVG Ring */}
            <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background ring */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Score ring */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    />
                </svg>

                {/* Center number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="text-3xl font-bold"
                        style={{ color }}
                    >
                        {animatedScore}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        / 100
                    </span>
                </div>
            </div>

            {/* Label badge */}
            <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                    backgroundColor: `${color}15`,
                    color: color,
                }}
            >
                {label}
            </span>
        </div>
    );
}
