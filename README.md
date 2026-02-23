# 📊 Social Media Content Analyzer

AI-powered tool that extracts text from PDFs and images, then analyzes it for social media engagement potential.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## ✨ Features

- **Document Upload** — Drag-and-drop or browse for PDF, JPEG, and PNG files (max 10MB)
- **Text Extraction** — PDF parsing via `pdf-parse`, OCR for images via `Tesseract.js`
- **AI Analysis** — Engagement score, tone analysis, strengths/weaknesses, improved version, hashtag suggestions
- **Dark Mode** — Toggle with system preference detection and persistence
- **Upload History** — Last 5 results saved in localStorage for quick review
- **Copy to Clipboard** — One-click copy for extracted text, improved version, and hashtags
- **Responsive Design** — Mobile-first layout with glassmorphism header

## 🏗 Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── upload/route.ts       # File upload + text extraction endpoint
│   │   └── analyze/route.ts      # AI content analysis endpoint
│   ├── layout.tsx                # Root layout (SEO, fonts, dark mode)
│   ├── page.tsx                  # Main analyzer page (state orchestration)
│   └── globals.css               # Tailwind + custom styles
├── components/                   # React components
│   ├── FileUpload.tsx            # Drag-and-drop with react-dropzone
│   ├── LoadingSpinner.tsx        # Multi-stage progress indicator
│   ├── ErrorBanner.tsx           # Dismissible error display
│   ├── ExtractedText.tsx         # Collapsible text viewer with copy
│   ├── EngagementChart.tsx       # Animated circular score chart
│   ├── AnalysisResults.tsx       # Score, tone, strengths/weaknesses
│   ├── ImprovedVersion.tsx       # Optimized text with copy button
│   ├── HashtagBadges.tsx         # Hashtag badges with copy-all
│   ├── DarkModeToggle.tsx        # Theme toggle
│   ├── Header.tsx                # Sticky glassmorphism header
│   └── UploadHistory.tsx         # Recent uploads sidebar
├── services/                     # Backend business logic
│   ├── extractionService.ts      # PDF parsing + OCR extraction
│   └── analysisService.ts        # OpenAI integration + mock fallback
├── lib/
│   └── utils.ts                  # Validation, sanitization, helpers
└── types/
    └── index.ts                  # Shared TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd unthinkable

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI-powered analysis. Without it, the app uses a built-in mock analyzer. |
| `MAX_FILE_SIZE_MB` | Optional | Maximum upload file size in MB (default: 10) |

## 📡 API Endpoints

### `POST /api/upload`
Upload a file and extract text.
- **Body**: `multipart/form-data` with `file` field
- **Accepts**: PDF, JPEG, PNG (≤ 10MB)
- **Returns**: `{ text, filename, fileType }`

### `POST /api/analyze`
Analyze extracted text for social media engagement.
- **Body**: `{ text: string }`
- **Returns**: `{ analysis: { tone_analysis, engagement_score, strengths, weaknesses, improved_version, suggested_hashtags } }`

## 🧠 AI Analysis Prompt

The system prompt instructs the LLM to evaluate:
- **Tone** (formal, casual, promotional, etc.)
- **Clarity & Readability**
- **Call-to-Action strength**
- **Emotional engagement potential**
- **Length optimization** for social platforms
- **Hashtag strategy**

Without an OpenAI API key, the mock analyzer uses text heuristics (word count, sentence length, punctuation patterns) to produce realistic results.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add `OPENAI_API_KEY` in Vercel Dashboard → Settings → Environment Variables.

### Build for Production

```bash
npm run build
npm start
```

## 🛡 Security

- Server-side MIME type validation
- Text sanitization (control characters, null bytes)
- Request body size limits
- API keys never exposed to frontend
- CORS handled by Next.js defaults

## 📄 License

MIT
