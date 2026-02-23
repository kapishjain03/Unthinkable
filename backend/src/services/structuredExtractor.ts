import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StructuredContent } from "../types";

const EXTRACTION_PROMPT = `
You are a social media data extractor. Analyze the provided social media post screenshot and extract the following information.

Provide your extraction as a JSON object with EXACTLY this structure (no markdown, no code fences):
{
  "username": "The handle or name of the poster",
  "caption": "The full text of the post caption (exclude comments)",
  "hashtags": ["list", "of", "hashtags"],
  "likes_count": number | null,
  "comments_count": number | null,
  "shares_count": number | null,
  "timestamp": "The visible date/time of the post",
  "detected_language": "The ISO language code (e.g., 'en', 'es')"
}

Guidelines:
- If a count is not visible, set it to null. Do not guess.
- Convert shorthand numbers like '10K' to 10000.
- Clean the caption of any OCR noise but preserve structure.
`;

export async function extractStructuredContent(buffer: Buffer, mimeType: string): Promise<StructuredContent> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const base64Image = buffer.toString("base64");

    const result = await model.generateContent([
        EXTRACTION_PROMPT,
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
        const parsed: StructuredContent = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error("Failed to parse structured extraction result:", content);
        throw new Error("Failed to extract structured data from screenshot.");
    }
}
