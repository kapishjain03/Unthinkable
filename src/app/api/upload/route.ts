import { NextRequest, NextResponse } from "next/server";
import { extractFromPDF } from "@/services/extractionService";
import { classifyImage } from "@/services/imageClassifier";
import { extractStructuredContent } from "@/services/structuredExtractor";
import { validateContent } from "@/services/contentValidator";
import { isValidMimeType } from "@/lib/utils";

// Disable Next.js body parser — we handle raw form data
export const runtime = "nodejs";

// Max file size: 10MB
const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10)) * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        // Validate file presence
        if (!file) {
            return NextResponse.json(
                { error: "No file provided. Please upload a PDF, JPEG, or PNG file." },
                { status: 400 }
            );
        }

        // Validate MIME type
        const mimeType = file.type;
        if (!isValidMimeType(mimeType)) {
            return NextResponse.json(
                {
                    error: `Unsupported file type: ${mimeType}. Accepted types: PDF, JPEG, PNG.`,
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            const maxMB = MAX_SIZE / (1024 * 1024);
            return NextResponse.json(
                {
                    error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${maxMB}MB.`,
                },
                { status: 400 }
            );
        }

        // Convert File to Buffer for processing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // --- PDF Path ---
        if (mimeType === "application/pdf") {
            try {
                const extractedText = await extractFromPDF(buffer);
                return NextResponse.json({
                    text: extractedText,
                    filename: file.name,
                    fileType: mimeType,
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown PDF parsing error";
                return NextResponse.json({ error: `PDF parsing failed: ${message}` }, { status: 422 });
            }
        }

        // --- Image Path (Classification & Extraction) ---
        try {
            // 1. Classification
            const classification = await classifyImage(buffer, mimeType);

            if (!classification.is_social_post || classification.platform === "unknown") {
                return NextResponse.json(
                    { error: "Unsupported image type. Please upload a social media screenshot (Instagram, X, LinkedIn, or Facebook)." },
                    { status: 422 }
                );
            }

            if (classification.confidence < 0.6) {
                return NextResponse.json(
                    { error: "The uploaded image does not appear to be a valid social media post (low confidence)." },
                    { status: 422 }
                );
            }

            // 2. Structured Extraction
            const structuredData = await extractStructuredContent(buffer, mimeType);
            structuredData.platform = classification.platform;

            // 3. Validation
            const validation = validateContent(structuredData);
            if (!validation.isValid) {
                return NextResponse.json({ error: validation.error }, { status: 422 });
            }

            return NextResponse.json({
                filename: file.name,
                fileType: mimeType,
                classification,
                structuredData,
                text: structuredData.caption, // Fallback for components expecting 'text'
            });

        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown image processing error";
            return NextResponse.json({ error: `Image processing failed: ${message}` }, { status: 500 });
        }

    } catch (error) {
        console.error("Upload endpoint error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while processing your file. Please try again." },
            { status: 500 }
        );
    }
}
