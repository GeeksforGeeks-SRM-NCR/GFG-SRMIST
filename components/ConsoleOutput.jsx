'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Terminal, Loader2, AlertCircle } from 'lucide-react';

const ConsoleOutput = ({ results, status, isRunning, error, submissionResult }) => {
    if (submissionResult) {
        const isSuccess = submissionResult.status === 'Success';
        const grading = submissionResult.gradingResult;

        return (
            <div className="h-full w-full flex flex-col bg-gradient-to-b from-black to-black/95 text-white overflow-hidden">
                {/* Header */}
                <div className={`p-4 border-b ${isSuccess ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                    <div className="flex items-center gap-3">
                        {isSuccess ? (
                            <CheckCircle size={20} className="text-green-400" />
                        ) : (
                            <XCircle size={20} className="text-red-400" />
                        )}
                        <span className={`text-sm font-semibold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                            Submission {submissionResult.status}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-6 space-y-4">
                    <p className={`text-sm ${isSuccess ? 'text-gray-300' : 'text-red-300'}`}>
                        {submissionResult.message}
                    </p>
                    
                    {isSuccess && grading && (
                         <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Grading Result</h3>
                                <div className="text-2xl font-bold text-green-400">
                                    {grading.total_score}{' '}
                                    <span className="text-base font-normal text-gray-400">/ {grading.max_marks}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {Object.entries(grading.details).map(([key, value]) => (
                                    <div key={key} className="bg-black/50 p-3 rounded-lg border border-white/10">
                                        <div className="capitalize text-gray-400 text-xs mb-1">{key.replace(/_/g, ' ')}</div>
                                        <div className="font-medium text-white">
                                            Score: {value.score} / {value.max}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (isRunning) {
        return (
            <div className="h-full w-full bg-gradient-to-b from-black to-black/95 text-white overflow-auto">
                <div className="p-4 border-b border-white/10 bg-blue-500/10">
                    <div className="flex items-center gap-3">
                        <Loader2 size={18} className="animate-spin text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">Running Code...</span>
                    </div>
                </div>
                <div className="p-6 flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <div className="flex justify-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <p className="text-sm text-gray-400">Executing test cases...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full w-full bg-gradient-to-b from-black to-black/95 text-white overflow-auto">
                <div className="p-4 border-b border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-400" />
                        <span className="text-sm font-semibold text-red-400">Execution Error</span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">{error}</pre>
                    </div>
                </div>
            </div>
        );
    }

    if (!results && !status) {
        return (
            <div className="h-full w-full bg-gradient-to-b from-black to-black/95 text-white overflow-auto flex items-center justify-center">
                <div className="text-center space-y-3 p-6">
                    <Terminal size={40} className="mx-auto text-gray-600" />
                    <p className="text-sm text-gray-500">Run your code to see output</p>
                    <p className="text-xs text-gray-600">Click "Run Code" to test against sample cases</p>
                </div>
            </div>
        );
    }

    const passedCount = results ? results.filter(r => r.passed).length : 0;
    const totalCount = results ? results.length : 0;

    return (
        <div className="h-full w-full flex flex-col bg-gradient-to-b from-black to-black/95 text-white overflow-hidden">
            {/* Header */}
            <div className={`p-4 border-b ${status === 'Passed' ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {status === 'Passed' ? (
                            <CheckCircle size={20} className="text-green-400" />
                        ) : (
                            <XCircle size={20} className="text-red-400" />
                        )}
                        <span className={`text-sm font-semibold ${status === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>
                            {status === 'Passed' ? 'All Tests Passed!' : 'Some Tests Failed'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Test Cases:</span>
                        <span className={`text-sm font-bold ${status === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>
                            {passedCount}/{totalCount}
                        </span>
                    </div>
                </div>
                {status === 'Passed' && (
                    <div className="mt-3 pt-3 border-t border-green-500/20">
                        <p className="text-xs text-green-300/80">
                            ✨ Problem solved! Go back to <Link href="/practice" className="underline hover:text-green-200 font-semibold">Practice Page</Link> to see your updated stats and checkmark.
                        </p>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-3">
                    {results && results.map((res, idx) => (
                        <div 
                            key={idx} 
                            className={`rounded-xl border ${
                                res.passed 
                                    ? 'border-green-500/30 bg-green-500/5' 
                                    : 'border-red-500/30 bg-red-500/5'
                            } overflow-hidden transition-all hover:shadow-lg ${
                                res.passed ? 'hover:shadow-green-500/20' : 'hover:shadow-red-500/20'
                            }`}
                        >
                            {/* Test Case Header */}
                            <div className={`px-4 py-2 flex items-center justify-between ${
                                res.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                                <span className="text-xs font-semibold text-white">Test Case {idx + 1}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    res.passed 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {res.passed ? "✓ PASSED" : "✗ FAILED"}
                                </span>
                            </div>

                            {/* Test Case Details */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1.5 font-medium">Input:</div>
                                    <div className="bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-xs text-gray-300">
                                        {res.input}
                                    </div>
                                </div>

                                {!res.passed && (
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1.5 font-medium">Expected Output:</div>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 font-mono text-xs text-green-300">
                                            {res.expected}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-xs text-gray-400 mb-1.5 font-medium">
                                        {res.passed ? 'Output:' : 'Your Output:'}
                                    </div>
                                    <div className={`border rounded-lg p-3 font-mono text-xs ${
                                        res.passed 
                                            ? 'bg-white/5 border-white/10 text-gray-300' 
                                            : 'bg-red-500/10 border-red-500/30 text-red-300'
                                    }`}>
                                        {res.actual}
                                    </div>
                                </div>

                                {res.stderr && (
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1.5 font-medium flex items-center gap-1.5">
                                            <AlertCircle size={12} />
                                            Error Output:
                                        </div>
                                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 font-mono text-xs text-red-300">
                                            {res.stderr}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConsoleOutput;
