"use client";
export default function SampleFormat() {
    return (
        <div className="mb-8 bg-slate-700/30 border border-slate-600 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Sample PDF Format</h2>
            <p className="text-slate-300 text-sm mb-3">
                Your PDF should contain questions and answers in the following format:
            </p>
            <div className="bg-slate-800 rounded p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                <pre>{`Question1: What is 2 + 2?
Answer1: 4

Question2: What is the capital of France?
Answer2: Paris`}</pre>
            </div>
        </div>
    )
}