'use client';

import React from 'react';
import { CheckCircle, XCircle, Terminal } from 'lucide-react';

const ConsoleOutput = ({ results, status, isRunning, error }) => {
    if (isRunning) {
        return (
            <div className="h-full w-full p-4 bg-black/90 text-gray-300 font-mono text-sm overflow-auto border-t border-border">
                <div className="flex items-center gap-2 animate-pulse">
                    <Terminal size={16} />
                    <span>Running code...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full w-full p-4 bg-black/90 text-red-400 font-mono text-sm overflow-auto border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                    <XCircle size={16} />
                    <span className="font-bold">Execution Error</span>
                </div>
                <pre>{error}</pre>
            </div>
        );
    }

    if (!results && !status) {
        return (
            <div className="h-full w-full p-4 bg-black/90 text-gray-500 font-mono text-sm overflow-auto border-t border-border flex items-center justify-center">
                <span>Run code to see output</span>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-black/90 text-gray-100 font-mono text-sm border-t border-border">
            <div className={`p-2 border-b border-white/10 flex items-center gap-2 ${status ? 'text-green-400' : 'text-red-400'}`}>
                {status ? <CheckCircle size={16} /> : <XCircle size={16} />}
                <span className="font-bold">{status ? 'All Tests Passed' : 'Tests Failed'}</span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {results && results.map((res, idx) => (
                    <div key={idx} className="space-y-1 pb-4 border-b border-white/10 last:border-0">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Test Case {idx + 1}</span>
                            <span className={res.passed ? "text-green-500" : "text-red-500"}>
                                {res.passed ? "PASSED" : "FAILED"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <span className="text-gray-500 text-xs">Input:</span>
                                <div className="bg-white/5 p-2 rounded text-xs">{res.input}</div>
                            </div>
                            {!res.passed && (
                                <div>
                                    <span className="text-gray-500 text-xs">Expected:</span>
                                    <div className="bg-white/5 p-2 rounded text-xs text-green-300/80">{res.expected}</div>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 text-xs">Output:</span>
                                <div className={`bg-white/5 p-2 rounded text-xs ${res.passed ? 'text-gray-300' : 'text-red-300'}`}>
                                    {res.actual}
                                </div>
                            </div>
                            {res.stderr && (
                                <div>
                                    <span className="text-gray-500 text-xs">Stderr:</span>
                                    <div className="bg-red-900/20 p-2 rounded text-xs text-red-300">{res.stderr}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsoleOutput;
