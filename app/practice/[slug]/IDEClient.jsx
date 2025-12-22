'use client';

import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ConsoleOutput from '@/components/ConsoleOutput';
import { Play, Send, ChevronDown, Code2, BookOpen, ListChecks, ArrowLeft, Maximize2, Minimize2, Timer, TrendingUp } from 'lucide-react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';

const IDEClient = ({ problem, initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [language, setLanguage] = useState('javascript');
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const [executionStatus, setExecutionStatus] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description'); // description | hints | submissions
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reset scroll position when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const starterCodes = problem.fields.starterCode || {};

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (starterCodes[newLang]) {
            setCode(starterCodes[newLang]);
        } else {
            if (newLang === 'python') setCode("# Start coding here...\nprint('Hello World')");
            else if (newLang === 'javascript') setCode("// Start coding here...\nconsole.log('Hello World')");
            else if (newLang === 'c++') setCode("#include <iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello World\";\n  return 0;\n}");
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setExecutionResult(null);
        setError(null);
        setExecutionStatus(null);

        try {
            const response = await fetch('/api/code/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    language,
                    problemSlug: problem.fields.slug,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Execution failed');
            }

            setExecutionResult(data.results);
            setExecutionStatus(data.passed ? 'Passed' : 'Failed');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    const difficultyConfig = {
        Easy: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
        Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
        Hard: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    };

    const config = difficultyConfig[problem.fields.difficulty] || { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };

    // Safe description extraction
    const getDescriptionText = (desc) => {
        if (!desc) return 'Solve this problem by implementing the required algorithm.';
        if (typeof desc === 'string') return desc;

        if (desc.content && Array.isArray(desc.content)) {
            const texts = [];
            const extractText = (node) => {
                if (node.nodeType === 'text') {
                    texts.push(node.value);
                } else if (node.content && Array.isArray(node.content)) {
                    node.content.forEach(extractText);
                }
            };
            desc.content.forEach(extractText);
            return texts.join(' ').trim() || 'Solve this problem by implementing the required algorithm.';
        }

        return 'Solve this problem by implementing the required algorithm.';
    };

    const descriptionText = getDescriptionText(problem.fields.description);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/practice"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Problems</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-lg font-bold text-white">{problem.fields.title}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${config.border} ${config.bg} ${config.color}`}>
                        {problem.fields.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                {/* Left Panel: Problem Description */}
                <div className={`${isFullscreen ? 'hidden' : 'w-full lg:w-[450px] h-auto lg:h-full'} flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-black`}>
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 bg-white/5">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'description'
                                ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <BookOpen size={16} />
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'submissions'
                                ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ListChecks size={16} />
                            Submissions
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {activeTab === 'description' && (
                            <>
                                {/* Problem Description */}
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-3">Problem Statement</h2>
                                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {descriptionText}
                                    </p>
                                </div>

                                {/* Example Section */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-3">Example</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-400">Input:</span>
                                            <div className="mt-1 p-2 bg-black/50 rounded border border-white/10 font-mono text-gray-300">
                                                [1, 2, 3, 4, 5]
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Output:</span>
                                            <div className="mt-1 p-2 bg-black/50 rounded border border-white/10 font-mono text-gray-300">
                                                15
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Explanation:</span>
                                            <p className="mt-1 text-gray-300">
                                                Sum of all elements: 1 + 2 + 3 + 4 + 5 = 15
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Constraints */}
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-3">Constraints</h3>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Time Limit: 2 seconds</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Memory Limit: 256 MB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>1 ≤ array length ≤ 10⁵</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="text-center py-12">
                                <TrendingUp className="mx-auto mb-4 text-gray-600" size={48} />
                                <p className="text-gray-500">No submissions yet</p>
                                <p className="text-sm text-gray-600 mt-2">Submit your solution to see it here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Code Editor - FIXED FOR BOTH PORTRAIT AND LANDSCAPE MOBILE */}
                <div className={`${isFullscreen ? 'w-full' : 'w-full lg:flex-1'} flex flex-col bg-black min-h-[500px] h-[calc(100vh-64px)] lg:h-full`}>
                    {/* Toolbar */}
                    <div className="h-14 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Code2 size={16} />
                                <span className="font-medium hidden sm:inline">Code Editor</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-black/50 border border-white/20 text-white text-sm rounded-lg px-4 py-1.5 pr-10 focus:outline-none focus:border-green-400 appearance-none cursor-pointer transition-colors hover:border-white/40"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="c++">C++</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                            >
                                <Play size={16} fill="currentColor" />
                                {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Send size={16} />
                                Submit
                            </button>
                        </div>
                    </div>

                    {/* Editor Area - FIXED FOR HORIZONTAL MOBILE VIEW */}
                    <div className="flex-1 flex flex-col min-h-0 w-full">
                        <div className="flex-1 min-h-0 min-w-0 relative">
                            {/* Absolute positioned wrapper to ensure full expansion */}
                            <div className="absolute inset-0 w-full h-full">
                                <CodeEditor
                                    code={code}
                                    language={language === 'c++' ? 'cpp' : language}
                                    onChange={setCode}
                                />
                            </div>
                        </div>

                        {/* Console Output */}
                        <div className="h-64 border-t border-white/10 shrink-0 min-h-[200px]">
                            <ConsoleOutput
                                results={executionResult}
                                status={executionStatus}
                                isRunning={isRunning}
                                error={error}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDEClient;