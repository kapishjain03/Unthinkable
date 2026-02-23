import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const results: any = {};

    const variants = ["gemini-1.5-flash", "gemini-flash-latest", "gemini-2.0-flash", "gemini-2.0-flash-lite-001", "gemini-pro-latest"];

    for (const v of variants) {
        try {
            const model = genAI.getGenerativeModel({ model: v });
            await model.generateContent("test");
            results[v] = "OK";
            console.log(`✅ ${v}: OK`);
        } catch (e: any) {
            results[v] = e.message;
            console.log(`❌ ${v}: ${e.message}`);
        }
    }

    fs.writeFileSync("diag_results.json", JSON.stringify(results, null, 2));
}

listModelsRaw();
