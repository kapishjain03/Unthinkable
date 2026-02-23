"use client";

/**
 * Main Analyzer Page
 *
 * Orchestrates the complete flow:
 * 1. File upload → 2. Text extraction → 3. AI analysis → 4. Results display
 *
 * Manages application state machine and persists history in localStorage.
 */

import { useState, useCallback, useEffect } from "react";
import type { AnalysisResult, HistoryEntry, AppStage, ClassificationResult, StructuredContent } from "@/types";
import { generateId } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBanner from "@/components/ErrorBanner";
import ExtractedText from "@/components/ExtractedText";
import AnalysisResults from "@/components/AnalysisResults";
import ImprovedVersion from "@/components/ImprovedVersion";
import HashtagBadges from "@/components/HashtagBadges";
import UploadHistory from "@/components/UploadHistory";

const MAX_HISTORY = 5;

export default function HomePage() {
    // Application state
    const [stage, setStage] = useState<AppStage>("idle");
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [extractedText, setExtractedText] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [classification, setClassification] = useState<ClassificationResult | null>(null);
    const [structuredData, setStructuredData] = useState<StructuredContent | null>(null);

    // History
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [lastFile, setLastFile] = useState<File | null>(null);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("analyzer_history");
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch {
            // Ignore corrupt localStorage data
        }
    }, []);

    // Save history to localStorage
    const saveHistory = useCallback((entries: HistoryEntry[]) => {
        setHistory(entries);
        try {
            localStorage.setItem("analyzer_history", JSON.stringify(entries));
        } catch {
            // localStorage might be full
        }
    }, []);

    // Handle file upload and complete processing pipeline
    const handleFileAccepted = useCallback(async (file: File) => {
        setLastFile(file);
        setError(null);
        setAnalysis(null);
        setExtractedText("");
        setStage("uploading");

        try {
            // Step 1: Upload and extract text
            setStage("extracting");
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const err = await uploadRes.json();
                throw new Error(err.error || `Upload failed with status ${uploadRes.status}`);
            }

            const uploadData = await uploadRes.json();
            setExtractedText(uploadData.text || "");
            setFilename(uploadData.filename);
            setFileType(uploadData.fileType);
            setClassification(uploadData.classification || null);
            setStructuredData(uploadData.structuredData || null);

            // Step 2: Analyze content
            setStage("analyzing");
            const analyzeRes = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: uploadData.text,
                    structuredData: uploadData.structuredData,
                    platform: uploadData.classification?.platform
                }),
            });

            if (!analyzeRes.ok) {
                const err = await analyzeRes.json();
                throw new Error(err.error || `Analysis failed with status ${analyzeRes.status}`);
            }

            const analyzeData = await analyzeRes.json();
            setAnalysis(analyzeData.analysis);
            setStage("done");

            // Save to history
            const entry: HistoryEntry = {
                id: generateId(),
                filename: uploadData.filename,
                fileType: uploadData.fileType,
                timestamp: Date.now(),
                extractedText: uploadData.text || "",
                analysis: analyzeData.analysis,
                classification: uploadData.classification,
                structuredData: uploadData.structuredData,
            };

            saveHistory([entry, ...history].slice(0, MAX_HISTORY));
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(message);
            setStage("error");
        }
    }, [history, saveHistory]);

    // Load a history entry
    const handleHistorySelect = useCallback((entry: HistoryEntry) => {
        setExtractedText(entry.extractedText);
        setFilename(entry.filename);
        setFileType(entry.fileType);
        setAnalysis(entry.analysis);
        setClassification(entry.classification || null);
        setStructuredData(entry.structuredData || null);
        setError(null);
        setStage("done");
    }, []);

    // Clear history
    const handleClearHistory = useCallback(() => {
        saveHistory([]);
    }, [saveHistory]);

    // Reset to initial state
    const handleReset = useCallback(() => {
        setStage("idle");
        setError(null);
        setExtractedText("");
        setFilename("");
        setFileType("");
        setAnalysis(null);
        setClassification(null);
        setStructuredData(null);
        setLastFile(null);
    }, []);

    // Retry last upload
    const handleRetry = useCallback(() => {
        if (lastFile) {
            handleFileAccepted(lastFile);
        } else {
            handleReset();
        }
    }, [lastFile, handleFileAccepted, handleReset]);

    const isProcessing = stage === "uploading" || stage === "extracting" || stage === "analyzing";

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Header />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
                {/* Animated Hero section */}
                <div className="text-center mb-16 space-y-4 animate-fade-in">
                    <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/50 mb-2 uppercase tracking-widest">
                        AI-Powered Analysis
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                        Level Up Your <br />
                        <span className="gradient-text">Social Strategy</span>
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Upload PDFs or images to extract text and receive expert AI suggestions to boost your engagement.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main content area */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* File Upload */}
                        <div className="glass rounded-3xl p-1 shadow-2xl shadow-brand-500/5 overflow-hidden">
                            <FileUpload
                                onFileAccepted={handleFileAccepted}
                                isProcessing={isProcessing}
                            />
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <ErrorBanner
                                message={error}
                                onDismiss={handleReset}
                                onRetry={handleRetry}
                            />
                        )}

                        {/* Loading State */}
                        {isProcessing && (
                            <div className="glass rounded-3xl p-8">
                                <LoadingSpinner stage={stage} />
                            </div>
                        )}

                        {/* Results */}
                        {stage === "done" && analysis && (
                            <div className="space-y-10 animate-fade-in">
                                {/* Extracted Text */}
                                <div className="glass rounded-2xl overflow-hidden border-none shadow-lg">
                                    <ExtractedText text={extractedText} filename={filename} />
                                </div>

                                {/* Analysis Results */}
                                <AnalysisResults
                                    analysis={analysis}
                                    classification={classification}
                                    structuredData={structuredData}
                                />

                                {/* Improved Version */}
                                <ImprovedVersion text={analysis.improved_version} />

                                {/* Hashtags */}
                                <HashtagBadges hashtags={analysis.suggested_hashtags} />

                                {/* Analyze Another Button */}
                                <div className="flex justify-center pt-8">
                                    <button
                                        onClick={handleReset}
                                        className="group relative flex items-center gap-2 rounded-2xl bg-gray-900 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-gray-900 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        Analyze Another Document
                                        <span className="block w-4 h-4 rounded-full bg-brand-400 animate-pulse" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar — History */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="glass rounded-3xl p-6 shadow-xl border-none">
                            <UploadHistory
                                history={history}
                                onSelect={handleHistorySelect}
                                onClear={handleClearHistory}
                            />
                        </div>

                        {/* Bonus Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-xl font-bold mb-2 relative z-10">Unlock Your Growth 🚀</h4>
                            <p className="text-brand-100 text-sm leading-relaxed relative z-10">
                                Engaging content is the key to going viral. Use these AI insights to refine your voice and reach more people.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-24 py-12 border-t border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        &copy; {new Date().getFullYear()} ContentAnalyzer • Powered by Google Gemini
                    </p>
                </div>
            </footer>
        </div>
    );
}
