/**
 * Utility functions: validation, sanitization, and helpers
 */

export type SupportedFileType = "application/pdf" | "image/jpeg" | "image/png";

// Allowed MIME types for upload
export const ALLOWED_MIME_TYPES: SupportedFileType[] = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];

// Human-readable labels
export const FILE_TYPE_LABELS: Record<string, string> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG Image",
    "image/png": "PNG Image",
};

// Max file size in bytes (default 10MB)
export const MAX_FILE_SIZE_BYTES =
    (parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10)) * 1024 * 1024;

/**
 * Validate that the file MIME type is supported.
 */
export function isValidMimeType(mime: string): mime is SupportedFileType {
    return ALLOWED_MIME_TYPES.includes(mime as SupportedFileType);
}

/**
 * Validate file size is within the allowed limit.
 */
export function isValidFileSize(sizeBytes: number): boolean {
    return sizeBytes > 0 && sizeBytes <= MAX_FILE_SIZE_BYTES;
}

/**
 * Sanitize extracted text — remove control characters, normalize whitespace,
 * but preserve intentional line breaks.
 */
export function sanitizeText(raw: string): string {
    return raw
        // Remove null bytes and most control characters (keep \n, \r, \t)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        // Normalize Windows-style line endings
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        // Collapse excessive blank lines (more than 2 → 2)
        .replace(/\n{3,}/g, "\n\n")
        // Trim trailing whitespace per line
        .replace(/[ \t]+$/gm, "")
        // Trim leading/trailing whitespace from entire text
        .trim();
}

/**
 * Format file size for display (e.g. "2.4 MB").
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate a simple unique ID for history entries.
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Determine the score color based on engagement score.
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return "#22c55e"; // green
    if (score >= 60) return "#eab308"; // yellow
    if (score >= 40) return "#f97316"; // orange
    return "#ef4444"; // red
}

/**
 * Get a label for the score range.
 */
export function getScoreLabel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    if (score >= 20) return "Needs Work";
    return "Poor";
}
