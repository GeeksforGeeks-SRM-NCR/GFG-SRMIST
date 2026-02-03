// Review comment for pull request #59

// Replace hardcoded hex values with semantic tokens. Define these colors in tailwind.config.ts as semantic tokens (e.g., colors.background.admin: '#050505') instead of using arbitrary values like bg-[#050505]. This ensures consistency and makes future theme updates trivial. Example in tailwind.config.ts: colors: { background: { admin: '#050505', primary: '...' } }. Then use: bg-background-admin
