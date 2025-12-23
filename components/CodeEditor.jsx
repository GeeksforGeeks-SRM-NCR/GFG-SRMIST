'use client';

import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language, onChange, theme = 'vs-dark' }) => {
    const editorRef = useRef(null);

    const handleEditorChange = (value) => {
        onChange(value);
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Disable copy, cut, and paste commands in Monaco Editor
        editor.onKeyDown((e) => {
            const isCopy = (e.ctrlKey || e.metaKey) && e.code === 'KeyC';
            const isCut = (e.ctrlKey || e.metaKey) && e.code === 'KeyX';
            const isPaste = (e.ctrlKey || e.metaKey) && e.code === 'KeyV';

            if (isCopy || isCut || isPaste) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // Add context menu interception
        editor.onContextMenu((e) => {
            e.event.preventDefault();
            e.event.stopPropagation();
        });

        // Disable right-click context menu completely
        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
            editorDomNode.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }
    };

    return (
        <div 
            className="h-full w-full rounded-md overflow-hidden border border-border bg-card/50 backdrop-blur-sm"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
        >
            <Editor
                height="100%"
                width="100%"
                language={language}
                value={code}
                theme={theme}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    contextmenu: false, // Disable right-click menu
                    quickSuggestions: false, // Disable auto-suggestions that might help copying
                }}
            />
        </div>
    );
};

export default CodeEditor;
