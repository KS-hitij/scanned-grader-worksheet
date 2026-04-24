"use client";
import { useState } from "react";
import { Upload, CheckCircle, Zap } from "lucide-react";

export default function Home() {
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [answerSheetFile, setAnswerSheetFile] = useState<File | null>(null);

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAnswerKeyFile(e.target.files[0]);
    }
  };

  const handleAnswerSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAnswerSheetFile(e.target.files[0]);
    }
  };

  const handleUploadAnswerKey = async () => {
    if (!answerKeyFile) return;
    // TODO: Call uploadAnswers API
    console.log("Uploading answer key:", answerKeyFile.name);
  };

  const handleGradeSheet = async () => {
    if (!answerSheetFile) return;
    // TODO: Call gradeAnswerSheet API
    console.log("Grading sheet:", answerSheetFile.name);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-purple-600/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 py-20 sm:py-32 text-center relative">
          <div className="mb-8 inline-block">
            <div className="bg-linear-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
            Scanned Worksheet Grader
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Automatically grade scanned answer sheets using AI. Upload answer keys and let our intelligent system do the grading in seconds.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Get Started
            </button>
            <button className="border border-slate-400 text-slate-300 hover:text-white hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors">
            <Zap className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p className="text-slate-400">
              Process multiple worksheets in seconds with advanced AI vision technology.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 hover:border-purple-500/50 transition-colors">
            <Upload className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Easy Upload</h3>
            <p className="text-slate-400">
              Simply upload your answer keys and student sheets. No complex setup required.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 hover:border-pink-500/50 transition-colors">
            <CheckCircle className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Accurate Results</h3>
            <p className="text-slate-400">
              Get precise grading with detailed explanations for each answer.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Start Grading
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Answer Key Upload */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-400" />
              Upload Answer Key
            </h3>
            <p className="text-slate-400 mb-6">
              Upload a PDF containing the correct answers. This will be used to grade all student sheets.
            </p>

            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleAnswerKeyChange}
                className="hidden"
                id="answer-key-input"
              />
              <label
                htmlFor="answer-key-input"
                className="block border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300">
                  {answerKeyFile ? answerKeyFile.name : "Click to select PDF"}
                </p>
              </label>
            </div>

            <button
              onClick={handleUploadAnswerKey}
              disabled={!answerKeyFile}
              className="w-full mt-6 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Upload Answer Key
            </button>
          </div>

          {/* Answer Sheet Upload */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 hover:border-purple-500/50 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-purple-400" />
              Grade Answer Sheet
            </h3>
            <p className="text-slate-400 mb-6">
              Upload a scanned image of a student's answer sheet to get instant grading results.
            </p>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAnswerSheetChange}
                className="hidden"
                id="answer-sheet-input"
              />
              <label
                htmlFor="answer-sheet-input"
                className="block border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300">
                  {answerSheetFile ? answerSheetFile.name : "Click to select image"}
                </p>
              </label>
            </div>

            <button
              onClick={handleGradeSheet}
              disabled={!answerSheetFile}
              className="w-full mt-6 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Grade Answer Sheet
            </button>
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
