import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import IDEClient from './IDEClient';
import { createClient } from '@/lib/supabase-server';

async function getProblem(slug) {
    const response = await contentfulClient.getEntries({
        content_type: 'codingProblem',
        'fields.slug': slug,
        limit: 1,
    });
    return response.items[0];
}

export default async function ProblemPage({ params }) {
    const { slug } = await params; // Await params in newer Next.js versions (e.g. 15+, or ensure handled)
    // Check Next.js version in package.json: "16.0.7". 
    // Next 15+ params are async.

    const problem = await getProblem(slug);

    if (!problem) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Problem not found
            </div>
        );
    }

    // Get user for initial context (optional, or handle in client)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Pick starter code based on default language (likely JS)
    const starterCode = problem.fields.starterCode || {};
    const defaultCode = starterCode.javascript || "// Start coding here...";

    return (
        <div className="pt-20 min-h-screen">
            <IDEClient problem={problem} initialCode={defaultCode} />
        </div>
    );
}
