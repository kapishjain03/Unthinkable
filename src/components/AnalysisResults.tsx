"use client";

import {
    Activity,
    Target,
    Zap,
    AlertCircle,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    Users,
    MessageCircle,
    Heart,
    Share2,
    ShieldAlert,
    TrendingUp
} from "lucide-react";
import type { AnalysisResult, ClassificationResult, StructuredContent } from "@/types";
import EngagementChart from "./EngagementChart";

interface AnalysisResultsProps {
    analysis: AnalysisResult;
    classification?: ClassificationResult | null;
    structuredData?: StructuredContent | null;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case "instagram": return <Instagram className="w-5 h-5 text-pink-500" />;
        case "twitter": return <Twitter className="w-5 h-5 text-blue-400" />;
        case "linkedin": return <Linkedin className="w-5 h-5 text-blue-700" />;
        case "facebook": return <Facebook className="w-5 h-5 text-blue-600" />;
        default: return <Activity className="w-5 h-5 text-brand-500" />;
    }
};

export default function AnalysisResults({ analysis, classification, structuredData }: AnalysisResultsProps) {
    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header / Platform Info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <PlatformIcon platform={classification?.platform || "unknown"} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                            {classification?.platform || "Generic content"} Analysis
                        </h3>
                        {classification && (
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Vision Confidence:
                                </span>
                                <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${classification.confidence > 0.8 ? 'bg-green-500' : 'bg-orange-500'}`}
                                        style={{ width: `${classification.confidence * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {analysis.content_category && (
                    <div className="px-5 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-sm">
                        {analysis.content_category}
                    </div>
                )}
            </div>

            {/* Low Confidence Warning */}
            {classification && classification.confidence < 0.7 && (
                <div className="flex items-center gap-4 p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-600 dark:text-orange-400">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-bold leading-relaxed">
                        Platform detection confidence is below 70%. Semantic parsing may be partially affected by layout complexity.
                    </p>
                </div>
            )}

            {/* Metrics Grid (if from screenshot) */}
            {structuredData && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Engagement Hub", icon: Heart, value: structuredData.likes_count, color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/10" },
                        { label: "Community", icon: MessageCircle, value: structuredData.comments_count, color: "text-sky-500", bg: "bg-sky-500/5", border: "border-sky-500/10" },
                        { label: "Viral Reach", icon: Share2, value: structuredData.shares_count, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
                        { label: "Content Creator", icon: Users, value: structuredData.username, color: "text-indigo-500", bg: "bg-indigo-500/5", border: "border-indigo-500/10" },
                    ].map((metric, i) => (
                        <div key={i} className={`p-5 glass rounded-2xl border-none shadow-sm relative overflow-hidden group`}>
                            <div className="flex items-center gap-3 mb-2">
                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{metric.label}</span>
                            </div>
                            <div className="text-base font-black text-gray-900 dark:text-white truncate">
                                {metric.value === null ? "—" : metric.value}
                            </div>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent via-${metric.color.split('-')[1]}-500 to-transparent opacity-50`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Main Score & Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="glass rounded-3xl p-10 flex flex-col items-center border-none shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 via-violet-500 to-brand-500 animate-gradient-x" />

                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-8 self-center flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-brand-500" />
                            Engagement Index
                        </h3>

                        <EngagementChart score={analysis.engagement_score} />

                        {analysis.engagement_rate && (
                            <div className="mt-8 text-center px-6 py-3 bg-brand-500/5 rounded-2xl border border-brand-500/10">
                                <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.15em] block mb-1">
                                    Current Engagement Rate
                                </span>
                                <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
                                    {analysis.engagement_rate}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="glass rounded-3xl p-8 border-none relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-4 h-4 text-brand-500" />
                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Growth Strategy</span>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-brand-50/50 to-indigo-50/50 dark:from-brand-950/20 dark:to-indigo-950/20 p-6">
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                                &ldquo;{analysis.tone_analysis}&rdquo;
                            </p>
                        </div>
                        {analysis.hook_strength_score !== undefined && (
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hook Strength</span>
                                    <span className="text-xs font-black text-brand-500">{analysis.hook_strength_score}/10</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${analysis.hook_strength_score * 10}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Strengths */}
                    <div className="glass rounded-3xl p-8 border-none">
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Winning Factors</h4>
                        </div>
                        <ul className="space-y-4">
                            {analysis.strengths.map((s, i) => (
                                <li key={i} className="flex gap-4 text-sm text-gray-700 dark:text-gray-300 font-medium group">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="glass rounded-3xl p-8 border-none">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Optimization Areas</h4>
                        </div>
                        <ul className="space-y-4">
                            {analysis.weaknesses.map((w, i) => (
                                <li key={i} className="flex gap-4 text-sm text-gray-700 dark:text-gray-300 font-medium group">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Growth Roadmap */}
                    {analysis.growth_suggestions && (
                        <div className="glass rounded-3xl p-8 border-none bg-gradient-to-br from-indigo-500/5 to-brand-500/5">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Growth Roadmap</h4>
                            </div>
                            <ul className="space-y-3">
                                {analysis.growth_suggestions.map((item, i) => (
                                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex gap-3 italic">
                                        <span className="text-indigo-500 font-bold whitespace-nowrap">Step {i + 1}:</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
