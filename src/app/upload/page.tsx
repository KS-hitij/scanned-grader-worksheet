"use client";
import { useState } from "react";
import Link from "next/link";
import { Upload, Database, FileUp, AlertCircle } from "lucide-react";
import SampleFormat from "../components/sampleFormat";
import axios from 'axios';

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            (file) => file.type === "application/pdf"
        );

        if (droppedFiles.length === 0) {
            setMessage({ type: "error", text: "Only PDF files are allowed" });
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(
                (file) => file.type === "application/pdf"
            );

            if (selectedFiles.length === 0) {
                setMessage({ type: "error", text: "Only PDF files are allowed" });
                return;
            }

            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage({ type: "error", text: "Please select at least one file" });
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("answerKey", files[0]); // Replace 'answerKeyFile' with the actual file input for the answer key
            // TODO: Replace with actual Chroma DB API endpoint
            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setMessage({ type: "success", text: "Files uploaded successfully to Chroma DB!" });
                setFiles([]);
            } else {
                setMessage({ type: "error", text: "Failed to upload files. Please try again." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred during upload." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header Section */}
            <section className="relative overflow-hidden border-b border-slate-700">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 to-pink-600/10 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 py-16 text-center relative">
                    <div className="mb-6 inline-block">
                        <div className="bg-linear-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
                        Upload to Chroma DB
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Upload documents and files to create or update your Chroma DB collection. Your data will be indexed and ready for semantic search.
                    </p>
                </div>
            </section>

            {/* Upload Form Section */}
            <section className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
                    {/* Sample Format */}
                    <SampleFormat />
                    {/* File Upload */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Upload Files</h2>

                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${dragActive
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-slate-600 hover:border-purple-500 hover:bg-purple-500/5"
                                }`}
                        >
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-input"
                                name="answerKey"
                            />
                            <label htmlFor="file-input" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                                <p className="text-white text-lg font-medium mb-1">
                                    Drag and drop PDF files here
                                </p>
                                <p className="text-slate-400">
                                    or click to select PDF files from your computer
                                </p>
                                <p className="text-sm text-slate-500 mt-2">
                                    Only PDF files are supported
                                </p>
                            </label>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileUp className="w-5 h-5 text-purple-400" />
                                    Selected Files ({files.length})
                                </h3>
                                <div className="space-y-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <FileUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-slate-400 text-xs">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-400 hover:text-red-300 font-medium text-sm ml-2 flex-shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
                                ? "bg-green-500/10 border border-green-500/30"
                                : "bg-red-500/10 border border-red-500/30"
                                }`}
                        >
                            <AlertCircle
                                className={`w-5 h-5 flex-shrink-0 ${message.type === "success" ? "text-green-400" : "text-red-400"
                                    }`}
                            />
                            <p
                                className={`text-sm ${message.type === "success" ? "text-green-300" : "text-red-300"
                                    }`}
                            >
                                {message.text}
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleUpload}
                            disabled={isLoading || files.length === 0}
                            className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                            {isLoading ? "Uploading..." : "Upload to Chroma DB"}
                        </button>
                        <button
                            onClick={() => {
                                setFiles([]);
                                setMessage(null);
                            }}
                            disabled={isLoading}
                            className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-lg font-semibold transition-colors"
                        >
                            Clear
                        </button>
                        <Link href="/grade">
                            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
                                Go to Grade
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-700 mt-20 py-8">
                <div className="max-w-6xl mx-auto px-4 text-center text-slate-400">
                    <p>© 2026 Scanned Worksheet Grader. Powered by Gemini AI.</p>
                </div>
            </footer>
        </main>
    );
}
