"use client";
import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader, Image as ImageIcon } from "lucide-react";
import axios from "axios";

interface GradeResult {
    question: string;
    student_answer: string;
    correct_answer: string;
    score: number;
    explanation: string;
}

interface GradeResponse {
    success: boolean;
    message: string;
    result: GradeResult[];
}

export default function GradePage() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [gradeResults, setGradeResults] = useState<GradeResult[] | null>(null);

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
            (file) => file.type.startsWith("image/")
        );

        if (droppedFiles.length === 0) {
            setMessage({ type: "error", text: "Only image files are allowed" });
            return;
        }

        const file = droppedFiles[0];
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setMessage(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(
                (file) => file.type.startsWith("image/")
            );

            if (selectedFiles.length === 0) {
                setMessage({ type: "error", text: "Only image files are allowed" });
                return;
            }

            const file = selectedFiles[0];
            setImage(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
            setMessage(null);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        setMessage(null);
    };

    const handleGrade = async () => {
        if (!image) {
            setMessage({ type: "error", text: "Please select an image" });
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("studentAnswerKey", image);

            const response = await axios.post("/api/grade", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 && response.data.success) {
                setMessage({ type: "success", text: response.data.message });
                setGradeResults(response.data.result);
            } else {
                setMessage({ type: "error", text: "Failed to grade the worksheet. Please try again." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred during grading." });
            console.error(error);
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
                            <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
                        Grade Worksheet
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Upload a scanned worksheet image and let our AI automatically grade it for you. Get detailed feedback and scoring.
                    </p>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
                    {/* Image Upload */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Upload Worksheet Image</h2>

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
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-input"
                            />
                            <label htmlFor="file-input" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                                <p className="text-white text-lg font-medium mb-1">
                                    Drag and drop an image here
                                </p>
                                <p className="text-slate-400">
                                    or click to select an image from your computer
                                </p>
                                <p className="text-sm text-slate-500 mt-2">
                                    Supported formats: JPG, PNG, GIF, WebP
                                </p>
                            </label>
                        </div>

                        {/* Preview and File Info */}
                        {image && preview && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 overflow-auto max-h-96">
                                    <img
                                        src={preview}
                                        alt="Worksheet preview"
                                        className="max-w-full h-auto rounded"
                                    />
                                </div>
                                <div className="mt-4 p-3 bg-slate-700/30 border border-slate-600 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-white text-sm font-medium">{image.name}</p>
                                        <p className="text-slate-400 text-xs">{(image.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        onClick={removeImage}
                                        disabled={isLoading}
                                        className="text-red-400 hover:text-red-300 font-medium text-sm disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
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

                    {/* Grade Button */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleGrade}
                            disabled={isLoading || !image}
                            className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Grading...
                                </>
                            ) : (
                                "Grade Worksheet"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                removeImage();
                                setGradeResults(null);
                            }}
                            disabled={isLoading}
                            className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Results Table */}
                    {gradeResults && gradeResults.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6">Grading Results</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-600">
                                            <th className="text-left px-4 py-4 text-purple-300 font-semibold">Question</th>
                                            <th className="text-left px-4 py-4 text-purple-300 font-semibold">Student Answer</th>
                                            <th className="text-left px-4 py-4 text-purple-300 font-semibold">Correct Answer</th>
                                            <th className="text-center px-4 py-4 text-purple-300 font-semibold">Score</th>
                                            <th className="text-left px-4 py-4 text-purple-300 font-semibold">Explanation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeResults.map((result, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                                            >
                                                <td className="px-4 py-4 text-slate-300 text-sm max-w-xs">
                                                    {result.question}
                                                </td>
                                                <td className="px-4 py-4 text-slate-300 text-sm max-w-xs">
                                                    <div className="bg-slate-700/40 rounded px-3 py-2 border border-slate-600">
                                                        {result.student_answer}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-slate-300 text-sm max-w-xs">
                                                    <div className="bg-slate-700/40 rounded px-3 py-2 border border-slate-600">
                                                        {result.correct_answer}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        {result.score === 1 ? (
                                                            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                                <span className="text-green-300 font-semibold text-sm">
                                                                    {result.score}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                                                <span className="text-red-300 font-semibold text-sm">
                                                                    {result.score}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-slate-300 text-sm max-w-xs">
                                                    <div className="bg-slate-700/40 rounded px-3 py-2 border border-slate-600">
                                                        {result.explanation}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Stats */}
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
                                    <p className="text-slate-400 text-sm mb-2">Total Questions</p>
                                    <p className="text-white text-3xl font-bold">{gradeResults.length}</p>
                                </div>
                                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
                                    <p className="text-slate-400 text-sm mb-2">Correct Answers</p>
                                    <p className="text-green-400 text-3xl font-bold">
                                        {gradeResults.filter((r) => r.score === 1).length}
                                    </p>
                                </div>
                                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
                                    <p className="text-slate-400 text-sm mb-2">Score</p>
                                    <p className="text-purple-400 text-3xl font-bold">
                                        {Math.round(
                                            (gradeResults.filter((r) => r.score === 1).length /
                                                gradeResults.length) *
                                            100
                                        )}
                                        %
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Results Message */}
                    {gradeResults && gradeResults.length === 0 && (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <p className="text-slate-300">No grading results to display</p>
                        </div>
                    )}
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
