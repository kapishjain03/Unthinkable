import type { AnalysisResult, StructuredContent } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeEngagement } from "./engagementAnalyzer";

const SYSTEM_PROMPT = `You are a world-class social media viral growth strategist. Your goal is to analyze the provided text (extracted from a post, document, or image) and transform it into high-performing, high-engagement social media content.

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):

{
  "tone_analysis": "A concise breakdown of the current vibe and how it resonates with the target audience.",
  "engagement_score": <number from 0-100 indicating viral potential>,
  "strengths": ["list 2-3 things that are already working"],
  "weaknesses": ["list 2-3 specific engagement blockers (e.g., 'no clear hook', 'too wordy')"],
  "improved_version": "A complete, ready-to-post rewritten version. Include a killer hook, line breaks for readability, emotional triggers, and a strong Call to Action (CTA).",
  "suggested_hashtags": ["#viral_tag1", "#strategic_tag2", ...]
}

Focus your strategy on:
1. THE HOOK: The first line must grab attention instantly.
2. READABILITY: Use short sentences and line breaks.
3. EMOTION: Infuse the text with energy, curiosity, or value.
4. CALL TO ACTION: Tell the user exactly what to do (comment, share, click link, etc.).
5. PLATFORM FIT: Optimize for modern social feeds (Instagram, LinkedIn, X, etc.).

Be extremely actionable and results-oriented. Do not include any text other than the JSON object itself.`;

async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent([
        SYSTEM_PROMPT,
        `Analyze this extracted text for social media engagement:\n\n${text.slice(0, 8000)}`
    ]);

    const response = await result.response;
    const content = response.text();

    if (!content) {
        throw new Error("Gemini returned an empty response.");
    }

    try {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsedResult: AnalysisResult = JSON.parse(cleaned);
        return parsedResult;
    } catch (error) {
        console.error("Failed to parse Gemini response:", content);
        throw new Error("Failed to parse analysis results from AI.");
    }
}

function analyzeWithMock(text: string): AnalysisResult {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return {
        tone_analysis: "Neutral and approachable",
        engagement_score: wordCount > 20 ? 75 : 45,
        strengths: ["Clear and concise", "Neutral tone"],
        weaknesses: ["Missing a strong hook", "No call to action"],
        improved_version: `🚀 ${text}\n\nWhat do you think? 💬`,
        suggested_hashtags: ["#Content", "#SocialMedia"],
    };
}

export async function analyzeContent(
    text: string,
    structuredData?: StructuredContent,
    platform?: string
): Promise<AnalysisResult> {
    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here";

    if (!hasApiKey) {
        return analyzeWithMock(text);
    }

    try {
        if (structuredData && platform) {
            return await analyzeEngagement(structuredData, platform);
        }
        return await analyzeWithGemini(text);
    } catch (error) {
        console.error("Analysis failed, falling back to mock:", error);
        return analyzeWithMock(text);
    }
}
