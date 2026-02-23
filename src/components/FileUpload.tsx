"use client";

/**
 * FileUpload Component
 *
 * Drag-and-drop zone with file picker fallback using react-dropzone.
 * Validates file type and size client-side before upload.
 */

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, AlertCircle } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileUploadProps {
    onFileAccepted: (file: File) => void;
    isProcessing: boolean;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onFileAccepted, isProcessing }: FileUploadProps) {
    const [validationError, setValidationError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: unknown[]) => {
            setValidationError(null);

            // Handle rejections from dropzone
            if (rejectedFiles && (rejectedFiles as Array<{ errors: Array<{ code: string }> }>).length > 0) {
                const rejection = (rejectedFiles as Array<{ errors: Array<{ code: string }> }>)[0];
                const errorCode = rejection.errors[0]?.code;
                if (errorCode === "file-too-large") {
                    setValidationError(`File exceeds the maximum size of ${MAX_SIZE / (1024 * 1024)}MB.`);
                } else if (errorCode === "file-invalid-type") {
                    setValidationError("Unsupported file type. Please upload a PDF, JPEG, or PNG file.");
                } else {
                    setValidationError("File was rejected. Please check the file type and size.");
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                onFileAccepted(acceptedFiles[0]);
            }
        },
        [onFileAccepted]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_SIZE,
        multiple: false,
        disabled: isProcessing,
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          relative group cursor-pointer rounded-[2.5rem] p-12 text-center
          transition-all duration-500 ease-out overflow-hidden
          ${isProcessing
                        ? "bg-slate-50/50 dark:bg-slate-900/30 cursor-not-allowed opacity-60"
                        : isDragActive && !isDragReject
                            ? "glass scale-[1.02] ring-4 ring-brand-500/20"
                            : isDragReject
                                ? "bg-red-50/50 dark:bg-red-900/20 ring-4 ring-red-500/20"
                                : "glass hover:scale-[1.01] hover:shadow-2xl hover:shadow-brand-500/10"
                    }
        `}
            >
                <input {...getInputProps()} />

                {/* Decorative background glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 delay-100" />

                <div className="flex flex-col items-center gap-6 relative z-10">
                    {/* Icon with orbital effect */}
                    <div className="relative group/icon">
                        <div className="absolute inset-0 bg-brand-400 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                        <div
                            className={`
                relative rounded-3xl p-6 transition-all duration-500
                ${isDragActive
                                    ? "bg-brand-500 text-white scale-110 shadow-xl shadow-brand-500/30"
                                    : "bg-white dark:bg-slate-800 shadow-xl group-hover:bg-brand-500 group-hover:text-white group-hover:-translate-y-2"
                                }
              `}
                        >
                            <Upload
                                className="h-10 w-10 transition-transform duration-500 group-hover:rotate-12"
                            />
                        </div>
                    </div>

                    {/* Main text */}
                    <div className="max-w-xs mx-auto">
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            {isProcessing
                                ? "Processing your content..."
                                : isDragActive
                                    ? "Ready to extract!"
                                    : "Drop file to analyze"}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Join thousands of creators using AI to optimize their social media presence.
                        </p>
                    </div>

                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

                    {/* Accepted file types with pills */}
                    <div className="flex gap-2">
                        {["PDF", "JPEG", "PNG"].map((type) => (
                            <span key={type} className="px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client-side validation error */}
            {validationError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-fade-in">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {validationError}
                </div>
            )}
        </div>
    );
}
