/**
 * Text Extraction Service
 *
 * Handles PDF text extraction via pdf-parse and
 * image OCR via Tesseract.js.
 */

import { sanitizeText } from "@/lib/utils";

/**
 * Extract text from a PDF buffer using pdf-parse.
 * Preserves line breaks and basic formatting.
 */
export async function extractFromPDF(buffer: Buffer): Promise<string> {
    // Dynamic import to avoid bundling issues in edge runtime
    const pdfParse = (await import("pdf-parse")).default;

    const data = await pdfParse(buffer, {
        // Preserve page breaks
        pagerender: undefined,
    });

    const text = data.text;

    if (!text || text.trim().length === 0) {
        throw new Error("PDF appears to contain no extractable text. It may be a scanned document — try uploading as an image instead.");
    }

    return sanitizeText(text);
}

/**
 * Extract text from an image buffer using Tesseract.js OCR.
 * Supports JPEG and PNG formats.
 */
export async function extractFromImage(buffer: Buffer): Promise<string> {
    const Tesseract = await import("tesseract.js");

    const worker = await Tesseract.createWorker("eng", undefined, {
        // Suppress verbose logging in production
        logger: process.env.NODE_ENV === "development" ? (m: unknown) => console.log(m) : undefined,
    });

    try {
        const { data } = await worker.recognize(buffer);
        const text = data.text;

        if (!text || text.trim().length === 0) {
            throw new Error("OCR could not extract any readable text from this image. Please ensure the image contains clear, legible text.");
        }

        return sanitizeText(text);
    } finally {
        await worker.terminate();
    }
}
