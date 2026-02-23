import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Social Media Content Analyzer | AI-Powered Engagement Insights",
    description:
        "Upload a PDF or image and get AI-powered analysis of your social media content. Get engagement scores, tone analysis, improvement suggestions, and hashtag recommendations.",
    keywords: [
        "social media",
        "content analyzer",
        "engagement",
        "AI",
        "OCR",
        "PDF",
        "hashtags",
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans antialiased text-gray-900 dark:text-gray-100 selection:bg-brand-100 dark:selection:bg-brand-900">
                {/* Dynamic Background */}
                <div className="bg-mesh" />
                <div className="bg-dots fixed inset-0 z-[-5]" />

                {children}
            </body>
        </html>
    );
}
