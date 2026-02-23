/**
 * POST /api/analyze
 *
 * Accepts extracted text and returns structured social media
 * content analysis using OpenAI or the mock analyzer.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeContent } from "@/services/analysisService";

export const runtime = "nodejs";

// Maximum text length we'll analyze (prevent abuse)
const MAX_TEXT_LENGTH = 10000;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate text content
        const text = (body.text || "").trim();
        const structuredData = body.structuredData;
        const platform = body.platform;

        if (!text && !structuredData) {
            return NextResponse.json(
                { error: "Missing content to analyze. Please provide text or structured post data." },
                { status: 400 }
            );
        }

        // Run analysis
        try {
            const analysis = await analyzeContent(text || "", structuredData, platform);
            return NextResponse.json({ analysis });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown analysis error";
            console.error("Analysis service error:", err);
            return NextResponse.json(
                { error: `Content analysis failed: ${message}` },
                { status: 502 }
            );
        }
    } catch (error) {
        console.error("Analyze endpoint error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred during analysis. Please try again." },
            { status: 500 }
        );
    }
}
