// Supported file types for the platform
export type SupportedFileType = "application/pdf" | "image/jpeg" | "image/png";

// Image classification result
export interface ClassificationResult {
    is_social_post: boolean;
    platform: "instagram" | "twitter" | "linkedin" | "facebook" | "unknown";
    confidence: number;
}

// Structured content extracted from a social post
export interface StructuredContent {
    username: string;
    caption: string;
    hashtags: string[];
    likes_count: number | null;
    comments_count: number | null;
    shares_count: number | null;
    timestamp: string;
    detected_language: string;
    platform?: string;
}

// Analysis result returned by the AI engine
export interface AnalysisResult {
    tone_analysis: string;
    engagement_score: number;
    content_category?: string;
    hook_strength_score?: number;
    cta_present?: boolean;
    strengths: string[];
    weaknesses: string[];
    improved_version: string;
    suggested_hashtags: string[];
    growth_suggestions?: string[];
    engagement_rate?: string;
}

// Response from the upload/extract endpoint
export interface ExtractResponse {
    text?: string;
    filename: string;
    fileType: string;
    classification?: ClassificationResult;
    structuredData?: StructuredContent;
    error?: string;
}

// Response from the analyze endpoint
export interface AnalyzeResponse {
    analysis: AnalysisResult;
}

// API error response shape
export interface ApiError {
    error: string;
    details?: string;
}

// Upload history entry stored in localStorage
export interface HistoryEntry {
    id: string;
    filename: string;
    fileType: string;
    timestamp: number;
    extractedText: string;
    analysis: AnalysisResult;
    classification?: ClassificationResult;
    structuredData?: StructuredContent;
}

// Application state machine
export type AppStage =
    | "idle"
    | "uploading"
    | "extracting"
    | "analyzing"
    | "done"
    | "error";
