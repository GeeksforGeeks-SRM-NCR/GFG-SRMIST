'use client';

import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ConsoleOutput from '@/components/ConsoleOutput';
import { Play, Send, ChevronDown } from 'lucide-react';

const IDEClient = ({ problem, initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [language, setLanguage] = useState('javascript'); // Default
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const [executionStatus, setExecutionStatus] = useState(null); // 'Passed' | 'Failed'
    const [error, setError] = useState(null);

    // Parse starter code if it's string JSON, or use object
    const starterCodes = problem.fields.starterCode || {};

    // Update code when language changes if starter code exists
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (starterCodes[newLang]) {
            setCode(starterCodes[newLang]);
        } else {
            // Default snippet if missing
            if (newLang === 'python') setCode("print('Hello World')");
            else if (newLang === 'javascript') setCode("console.log('Hello World')");
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

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4">
            {/* Left Panel: Description */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 bg-card/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden text-white/90">
                <div className="p-6 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4">{problem.fields.title}</h1>
                    <div className={`inline-block px-2 py-1 rounded text-xs border mb-4 ${problem.fields.difficulty === 'Easy' ? 'border-green-500/50 text-green-400' :
                            problem.fields.difficulty === 'Medium' ? 'border-yellow-500/50 text-yellow-400' :
                                'border-red-500/50 text-red-400'
                        }`}>
                        {problem.fields.difficulty}
                    </div>

                    {/* Rich Text Rendering would go here. For now, using description raw/text or simple render */}
                    <div className="prose prose-invert max-w-none">
                        {/* Assuming description is potentially rich text, but we may need a renderer. 
                     For MVP, if it's just text or object: */}
                        {/* JSON.stringify(problem.fields.description) */}
                        {/* Or render document... */}
                        <p className="whitespace-pre-wrap text-sm text-gray-300">
                            {/* Temporary simple render if it's just a string or we handle rich text later */}
                            The problem description will verify your algorithm.
                            Check the test cases implicitly via the 'Run' button.
                        </p>
                        {/* Ideally use @contentful/rich-text-react-renderer */}
                    </div>
                </div>
            </div>

            {/* Right Panel: Editor & Console */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                {/* Toolbar */}
                <div className="h-14 bg-card/20 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between px-4">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-black/50 border border-white/10 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="c++">C++</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play size={14} /> Run
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:opacity-90 text-white text-sm font-medium rounded transition-colors"
                        >
                            <Send size={14} /> Submit
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 min-h-0 bg-card/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col">
                    <div className="flex-1 relative">
                        <CodeEditor
                            code={code}
                            language={language === 'c++' ? 'cpp' : language}
                            onChange={setCode}
                        />
                    </div>

                    {/* Console (Bottom Sheet style, fixed height for now) */}
                    <div className="h-48 border-t border-white/10 shrink-0">
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
    );
};

export default IDEClient;
