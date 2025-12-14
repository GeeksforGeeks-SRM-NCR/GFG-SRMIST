'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language, onChange, theme = 'vs-dark' }) => {
    const handleEditorChange = (value) => {
        onChange(value);
    };

    return (
        <div className="h-full w-full rounded-md overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
            <Editor
                height="100%"
                width="100%"
                language={language}
                value={code}
                theme={theme}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                }}
            />
        </div>
    );
};

export default CodeEditor;
