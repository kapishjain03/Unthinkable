import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Service Imports
import { extractFromPDF, extractFromImage } from "./services/extractionService";
import { analyzeContent } from "./services/analysisService";
import { classifyImage } from "./services/imageClassifier";
import { extractStructuredContent } from "./services/structuredExtractor";
import { validateContent } from "./services/contentValidator";

dotenv.config();

const app = express();

// --- Middleware ---
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '*']
        : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Error Logging & Handling ---
process.on("uncaughtException", (err) => {
    console.error("CRITICAL: Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("CRITICAL: Unhandled Rejection at:", reason);
});

// --- Health Check ---
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req: Request, res: Response) => {
    res.json({ status: "Social Media Analyzer Backend is running" });
});

// --- API Routes ---

/**
 * Upload and Extract Route
 */
app.post("/api/upload", async (req: Request, res: Response) => {
    const form = formidable({
        maxFiles: 1,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
            return res.status(400).json({ error: "File upload failed: " + err.message });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        try {
            const buffer = fs.readFileSync(file.filepath);
            const mimeType = file.mimetype || "";

            // 1. PDF Path
            if (mimeType === "application/pdf") {
                const text = await extractFromPDF(buffer);
                return res.json({
                    filename: file.originalFilename || "document.pdf",
                    fileType: mimeType,
                    text
                });
            }

            // 2. Image Path (Classification & Extraction)
            // Classification
            const classification = await classifyImage(buffer, mimeType);

            if (!classification.is_social_post || classification.platform === "unknown") {
                // Fallback to standard OCR if not a social post
                const text = await extractFromImage(buffer);
                return res.json({
                    filename: file.originalFilename || "image.png",
                    fileType: mimeType,
                    text
                });
            }

            if (classification.confidence < 0.6) {
                return res.status(422).json({
                    error: "Low confidence platform detection. Please ensure the screenshot clearly shows a social media post."
                });
            }

            // Structured Extraction
            const structuredData = await extractStructuredContent(buffer, mimeType);
            structuredData.platform = classification.platform;

            // Validation
            const validation = validateContent(structuredData);
            if (!validation.isValid) {
                return res.status(422).json({ error: validation.error });
            }

            return res.json({
                filename: file.originalFilename || "screenshot.png",
                fileType: mimeType,
                classification,
                structuredData,
                text: structuredData.caption // Use caption as text fallback
            });

        } catch (error: any) {
            console.error("Extraction error:", error);
            return res.status(500).json({ error: error.message || "Failed to extract content." });
        }
    });
});

/**
 * Analysis Route
 */
app.post("/api/analyze", async (req: Request, res: Response) => {
    const { text, structuredData, platform } = req.body;

    if (!text && !structuredData) {
        return res.status(400).json({ error: "Missing content to analyze." });
    }

    try {
        const analysisResult = await analyzeContent(text, structuredData, platform);
        return res.json({ analysis: analysisResult });
    } catch (error: any) {
        console.error("Analysis error:", error);
        return res.status(500).json({ error: error.message || "Analysis failed." });
    }
});

// --- Startup ---
const PORT = process.env.PORT || 3001;

const startServer = (port: string | number) => {
    const server = app.listen(port, () => {
        console.log(`\n🚀 Social Media Analyzer Backend started!`);
        console.log(`📍 Health Check: http://localhost:${port}/health`);
        console.log(`🔌 API Endpoint: http://localhost:${port}\n`);

        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ WARNING: GEMINI_API_KEY is not set. Using MOCK AI fallback.");
        }
    });

    server.on("error", (err: any) => {
        console.error("Server startup error:", err);
        process.exit(1);
    });
};

startServer(PORT);
