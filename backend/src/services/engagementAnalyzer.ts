import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, StructuredContent } from "../types";

const ENGAGEMENT_PROMPT = `
You are a senior social media growth strategist. Your goal is to analyze the provided caption and metrics to provide high-level engagement insights.

You will be provided with the platform, the caption, hashtags, and any visible metrics.

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no code fences):
{
  "engagement_score": 0-100,
  "content_category": "celebrity | personal | brand | meme | promo | education | entertainment | news",
  "hook_strength_score": 0-10,
  "cta_present": boolean,
  "tone_analysis": "Concise description of the voice and audience resonance.",
  "strengths": ["list 2-3 specific wins"],
  "weaknesses": ["list 2-3 engagement blockers"],
  "improved_version": "A viral-optimized rewrite of the caption with hooks and spacing.",
  "suggested_hashtags": ["#tag1", "#tag2", ...],
  "growth_suggestions": ["Actionable steps to scale this type of content"],
  "engagement_rate": "A percentage string if metrics are provided, otherwise a missing data note"
}

Guidelines:
1. THE HOOK: Evaluate if the first 2 lines stop the scroll.
2. CTAs: Check for explicit prompts to engage (comment, share, etc).
3. READABILITY: Evaluate line breaks and emoji usage.
4. METRICS: If likes/comments exist, estimate engagement. (engagement_rate = (likes + comments) / estimated_followers). If followers are unknown, state "Cannot accurately calculate without follower data."
5. PLATFORM BEST PRACTICES: Factor in if it's Instagram (visual/aesthetic), Twitter (concise/witty), LinkedIn (professional/value), or Facebook (community/personal).
`;

export async function analyzeEngagement(content: StructuredContent, platform: string): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const inputData = `
Platform: ${platform}
Username: ${content.username}
Caption: ${content.caption}
Hashtags: ${content.hashtags.join(", ")}
Likes: ${content.likes_count}
Comments: ${content.comments_count}
Shares: ${content.shares_count}
Timestamp: ${content.timestamp}
`;

    const result = await model.generateContent([
        ENGAGEMENT_PROMPT,
        `Analyze this content for ${platform} engagement:\n\n${inputData}`
    ]);

    const response = await result.response;
    const responseText = response.text();

    try {
        const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed: AnalysisResult = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error("Failed to parse engagement analysis result:", responseText);
        throw new Error("Failed to generate engagement insights.");
    }
}
