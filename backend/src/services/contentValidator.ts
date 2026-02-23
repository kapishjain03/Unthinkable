import type { StructuredContent } from "../types";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates whether the extracted content is suitable for social media analysis.
 */
export function validateContent(content: StructuredContent): ValidationResult {
    if (!content.caption || content.caption.trim().length < 10) {
        return {
            isValid: false,
            error: "The content is too short for a meaningful analysis (minimum 10 characters required).",
        };
    }

    const uiKeywords = ["settings", "profile", "edit", "notifications", "message", "following", "followers"];
    const lowerCaption = content.caption.toLowerCase();
    const uiMatchCount = uiKeywords.filter(word => lowerCaption.includes(word)).length;

    if (uiMatchCount > 4 && content.caption.length < 50) {
        return {
            isValid: false,
            error: "The image appears to be a screenshot of settings or a profile menu rather than a post.",
        };
    }

    return { isValid: true };
}
