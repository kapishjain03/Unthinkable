import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ClassificationResult } from "@/types";

const CLASSIFICATION_PROMPT = `
Analyze the provided image and determine if it is a screenshot of a social media post from one of the following platforms: Instagram, Twitter/X, LinkedIn, or Facebook.

Provide your classification as a JSON object with EXACTLY this structure (no markdown, no code fences):
{
  "is_social_post": boolean,
  "platform": "instagram" | "twitter" | "linkedin" | "facebook" | "unknown",
  "confidence": 0-1
}

Guidelines:
- "is_social_post" is true if the image clearly shows a post from a social feed.
- "platform" should be "unknown" if you can't identify it or if it's not one of the four listed.
- "confidence" should reflect how sure you are of both the classification and the platform.

Identify UI elements like heart/like icons, retweet buttons, feed structures, and headers to make your determination.
`;

export async function classifyImage(buffer: Buffer, mimeType: string): Promise<ClassificationResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Image = buffer.toString("base64");

    const result = await model.generateContent([
        CLASSIFICATION_PROMPT,
        {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        },
    ]);

    const response = await result.response;
    const content = response.text();

    try {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed: ClassificationResult = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error("Failed to parse classification result:", content);
        return {
            is_social_post: false,
            platform: "unknown",
            confidence: 0,
        };
    }
}
