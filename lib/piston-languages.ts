export const LANGUAGE_MAP: Record<string, { language: string; version: string; aliases?: string[] }> = {
    // Web & Scripting
    javascript: { language: 'javascript', version: '18.15.0', aliases: ['js', 'node'] },
    typescript: { language: 'typescript', version: '5.0.3', aliases: ['ts'] },
    python: { language: 'python', version: '3.10.0', aliases: ['py', 'py3'] },

    // System & Compiled
    java: { language: 'java', version: '15.0.2', aliases: [] },
    c: { language: 'c', version: '10.2.0', aliases: ['gcc'] },
    cpp: { language: 'c++', version: '10.2.0', aliases: ['c++', 'g++'] },
    csharp: { language: 'csharp', version: '6.12.0', aliases: ['cs', 'mono'] }, // Mono
    go: { language: 'go', version: '1.16.2', aliases: ['golang'] },
    rust: { language: 'rust', version: '1.68.2', aliases: ['rs'] },

    // Extras (Common in CP)
    swift: { language: 'swift', version: '5.3.3', aliases: [] },
    kotlin: { language: 'kotlin', version: '1.8.20', aliases: [] },
    ruby: { language: 'ruby', version: '3.0.1', aliases: ['rb'] },
};

export const getLanguageConfig = (lang: string) => {
    const normalized = lang.toLowerCase();

    // Direct match
    if (LANGUAGE_MAP[normalized]) return LANGUAGE_MAP[normalized];

    // Alias match
    for (const key in LANGUAGE_MAP) {
        if (LANGUAGE_MAP[key].aliases?.includes(normalized)) {
            return LANGUAGE_MAP[key];
        }
    }

    return null;
};
