const contentful = require('contentful-management');
require('dotenv').config({ path: '.env' });

// You need a Contentful Management Token (CMA Token) for this.
// Usually this is different from the Delivery Token (CDA).
// Usage: CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/seed-contentful.js

const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_PAT;
const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID; // Your Space ID
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID; // Usually 'master'

if (!MANAGEMENT_TOKEN || !SPACE_ID) {
    console.error('Error: Please set CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID environment variables.');
    console.error('You can find your Space ID in Contentful Settings -> General Settings.');
    console.error('You can generate a Management Token in Contentful Settings -> API Keys -> Content Management Tokens.');
    process.exit(1);
}

const client = contentful.createClient({
    accessToken: MANAGEMENT_TOKEN
});

const PROBLEMS = [
    {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
        ],
        testCases: JSON.stringify([
            { input: '2\n7\n11\n15\n9', output: '0 1', hidden: false },
            { input: '3\n2\n4\n6', output: '1 2', hidden: false }
        ])
    },
    {
        title: 'Reverse String',
        slug: 'reverse-string',
        difficulty: 'Easy',
        description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.',
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        testCases: JSON.stringify([
            { input: 'hello', output: 'olleh', hidden: false },
            { input: 'Hannah', output: 'hannaH', hidden: false }
        ])
    },
    {
        title: 'Palindrome Number',
        slug: 'palindrome-number',
        difficulty: 'Medium',
        description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. An integer is a palindrome when it reads the same backward as forward.',
        examples: [
            { input: 'x = 121', output: 'true' },
            { input: 'x = -121', output: 'false' },
            { input: 'x = 10', output: 'false' }
        ],
        testCases: JSON.stringify([
            { input: '121', output: 'true', hidden: false },
            { input: '-121', output: 'false', hidden: false },
            { input: '10', output: 'false', hidden: false }
        ])
    }
];

async function seed() {
    try {
        console.log(`Connecting to Space: ${SPACE_ID}...`);
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(ENVIRONMENT_ID);

        // Check if content type exists, if not create it (optional, focusing on entries)
        // Assuming 'codingProblem' content type exists as per previous code.
        // If not, we should create it. Let's try to get it first.
        let contentType;
        try {
            contentType = await environment.getContentType('codingProblem');
            console.log('Content Type "codingProblem" found.');
        } catch (e) {
            console.log('Content Type "codingProblem" not found. Creating it...');
            contentType = await environment.createContentTypeWithId('codingProblem', {
                name: 'Coding Problem',
                fields: [
                    { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: false },
                    { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false },
                    { id: 'difficulty', name: 'Difficulty', type: 'Symbol', required: true, localized: false },
                    { id: 'description', name: 'Description', type: 'Text', required: true, localized: false }, // Markdown
                    { id: 'testCases', name: 'Test Cases', type: 'Object', required: false, localized: false } // JSON
                ]
            });
            await contentType.publish();
            console.log('Content Type "codingProblem" created and published.');
        }

        // Helper to create Rich Text document
        const createRichText = (text) => ({
            nodeType: 'document',
            data: {},
            content: [
                {
                    nodeType: 'paragraph',
                    data: {},
                    content: [
                        {
                            nodeType: 'text',
                            value: text,
                            marks: [],
                            data: {}
                        }
                    ]
                }
            ]
        });

        console.log('Creating entries...');

        for (const problem of PROBLEMS) {
            try {
                // Check if entry exists by slug (search)
                const entries = await environment.getEntries({
                    'content_type': 'codingProblem',
                    'fields.slug': problem.slug
                });

                if (entries.total > 0) {
                    console.log(`Problem "${problem.title}" already exists. Skipping.`);
                    continue;
                }

                const entry = await environment.createEntry('codingProblem', {
                    fields: {
                        title: { 'en-US': problem.title },
                        slug: { 'en-US': problem.slug },
                        difficulty: { 'en-US': problem.difficulty },
                        description: { 'en-US': createRichText(problem.description) },
                        testCases: { 'en-US': JSON.parse(problem.testCases) }
                    }
                });
                await entry.publish();
                console.log(`Created and published: ${problem.title}`);

            } catch (err) {
                console.error(`Failed to create ${problem.title}:`, err.message);
                if (err.details && err.details.errors) {
                    console.error('Validation Errors:', JSON.stringify(err.details.errors, null, 2));
                }
            }
        }

        console.log('Seeding complete!');

    } catch (error) {
        console.error('Seeding Error:', error);
    }
}

seed();
