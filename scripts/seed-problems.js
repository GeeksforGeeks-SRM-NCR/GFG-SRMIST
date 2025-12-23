const { createClient } = require('contentful-management');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
if (!process.env.NEXT_PUBLIC_CONTENTFUL_PAT) {
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
}

const PROBLEMS_FILE_PATH = path.join(__dirname, 'data', 'problems.json');

// Helper to create Rich Text
function createRichText(text) {
    return {
        nodeType: 'document',
        data: {},
        content: text.split('\n\n').map(para => ({
            nodeType: 'paragraph',
            data: {},
            content: [{
                nodeType: 'text',
                value: para,
                marks: [],
                data: {}
            }]
        }))
    };
}

async function seed() {
    console.log('🚀 Starting Content Seeding...');
    // ... (rest of code) ...


    if (!process.env.NEXT_PUBLIC_CONTENTFUL_PAT || !process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
        console.error('❌ Missing Contentful environment variables (NEXT_PUBLIC_CONTENTFUL_PAT, NEXT_PUBLIC_CONTENTFUL_SPACE_ID)');
        process.exit(1);
    }

    const client = createClient({
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PAT,
    });

    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const environmentId = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || 'master';

    try {
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        console.log(`Connected to Space: ${spaceId}, Environment: ${environmentId}`);

        const problemsData = JSON.parse(fs.readFileSync(PROBLEMS_FILE_PATH, 'utf-8'));
        console.log(`Found ${problemsData.length} problems to process.`);

        for (const problem of problemsData) {
            const slug = problem.slug;

            // Check for existing entry
            const existingEntries = await environment.getEntries({
                content_type: 'codingProblem',
                'fields.slug': slug,
                limit: 1
            });

            if (existingEntries.total > 0) {
                console.log(`⏩ Skipped: ${problem.title} (Already exists)`);
                continue;
            }

            // Map fields to Contentful format (en-US locale)
            const fields = {
                title: { 'en-US': problem.title },
                slug: { 'en-US': problem.slug },
                difficulty: { 'en-US': problem.difficulty },
                description: { 'en-US': createRichText(problem.description) },
                starterCode: { 'en-US': problem.starterCode },
                testCases: { 'en-US': problem.testCases }
            };

            try {
                const entry = await environment.createEntry('codingProblem', {
                    fields: fields
                });

                await entry.publish();
                console.log(`✅ Created & Published: ${problem.title}`);
            } catch (err) {
                console.error(`❌ Failed: ${problem.title}`, err.message);
            }
        }

        console.log('✨ Seeding Completed!');

    } catch (error) {
        console.error('Script Failed:', error);
    }
}

seed();
