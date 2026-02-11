const contentful = require('contentful-management');
require('dotenv').config(); // Load env vars

// Usage: node scripts/setup-contentful.js

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_PAT || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN; // Prefer PAT for management
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID;

if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error('Missing Contentful configuration. Check .env file.');
    process.exit(1);
}

const client = contentful.createClient({
    accessToken: ACCESS_TOKEN,
});

async function run() {
    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(ENVIRONMENT_ID);

        console.log(`Connected to space: ${SPACE_ID}, environment: ${ENVIRONMENT_ID}`);

        // Create 'codingProblem' content type
        const contentTypeId = 'codingProblem';

        let contentType;
        try {
            contentType = await environment.getContentType(contentTypeId);
            console.log(`Content type '${contentTypeId}' already exists.`);
        } catch (e) {
            console.log(`Creating content type '${contentTypeId}'...`);
            contentType = await environment.createContentTypeWithId(contentTypeId, {
                name: 'Coding Problem',
                description: 'A coding problem for the Mini-LeetCode feature',
            });
        }

        // Define fields
        // title, slug, difficulty, description (Rich Text), starterCode (JSON), testCases (JSON)

        // title
        const titleField = contentType.fields.find(f => f.id === 'title');
        if (!titleField) {
            contentType.fields.push({
                id: 'title',
                name: 'Title',
                type: 'Symbol',
                required: true,
            });
        }

        // slug
        const slugField = contentType.fields.find(f => f.id === 'slug');
        if (!slugField) {
            contentType.fields.push({
                id: 'slug',
                name: 'Slug',
                type: 'Symbol',
                required: true,
                validations: [{ unique: true }],
            });
        }

        // difficulty
        const difficultyField = contentType.fields.find(f => f.id === 'difficulty');
        if (!difficultyField) {
            contentType.fields.push({
                id: 'difficulty',
                name: 'Difficulty',
                type: 'Symbol',
                required: true,
                validations: [{ in: ['Easy', 'Medium', 'Hard'] }],
            });
        }

        // description (Rich Text)
        const descriptionField = contentType.fields.find(f => f.id === 'description');
        if (!descriptionField) {
            contentType.fields.push({
                id: 'description',
                name: 'Description',
                type: 'RichText',
                required: true,
            });
        }

        // starterCode (JSON)
        const starterCodeField = contentType.fields.find(f => f.id === 'starterCode');
        if (!starterCodeField) {
            contentType.fields.push({
                id: 'starterCode',
                name: 'Starter Code',
                type: 'Object',
                required: true,
            });
        }

        // testCases (JSON)
        const testCasesField = contentType.fields.find(f => f.id === 'testCases');
        if (!testCasesField) {
            contentType.fields.push({
                id: 'testCases',
                name: 'Test Cases',
                type: 'Object',
                required: true,
            });
        }

        // Update and publish
        contentType = await contentType.update();
        await contentType.publish();
        console.log(`Content type '${contentTypeId}' updated and published.`);

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
