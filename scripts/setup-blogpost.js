/**
 * Setup Script: Create blogPost Content Type in Contentful
 * 
 * This script creates the blogPost content type for the blog/newsletter system.
 * Run with: node scripts/setup-blogpost.js
 */

require('dotenv').config();
const contentful = require('contentful-management');

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_PAT;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || 'master';

async function setupBlogPost() {
    try {
        console.log('🚀 Connecting to Contentful...');
        const client = contentful.createClient({ accessToken: ACCESS_TOKEN });
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(ENVIRONMENT_ID);

        console.log('✅ Connected to Contentful');
        console.log(`📦 Space: ${SPACE_ID}`);
        console.log(`🌍 Environment: ${ENVIRONMENT_ID}`);

        // Check if blogPost content type already exists
        try {
            const existingType = await environment.getContentType('blogPost');
            console.log('⚠️  blogPost content type already exists!');
            console.log('Skipping creation...');
            return;
        } catch (error) {
            if (error.name !== 'NotFound') throw error;
            console.log('✨ Creating blogPost content type...');
        }

        // Create blogPost content type
        const blogPost = await environment.createContentTypeWithId('blogPost', {
            name: 'Blog Post',
            description: 'A blog article/post for the website',
            displayField: 'title',
            fields: [
                {
                    id: 'title',
                    name: 'Title',
                    type: 'Symbol',
                    required: true,
                    localized: false,
                    validations: [
                        { size: { min: 1, max: 200 } }
                    ]
                },
                {
                    id: 'slug',
                    name: 'URL Slug',
                    type: 'Symbol',
                    required: true,
                    localized: false,
                    validations: [
                        { unique: true },
                        { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
                    ]
                },
                {
                    id: 'excerpt',
                    name: 'Excerpt',
                    type: 'Text',
                    required: false,
                    localized: false,
                    validations: [
                        { size: { max: 300 } }
                    ]
                },
                {
                    id: 'content',
                    name: 'Content',
                    type: 'RichText',
                    required: true,
                    localized: false,
                    validations: [
                        {
                            enabledNodeTypes: [
                                'heading-1',
                                'heading-2',
                                'heading-3',
                                'heading-4',
                                'heading-5',
                                'heading-6',
                                'ordered-list',
                                'unordered-list',
                                'hr',
                                'blockquote',
                                'embedded-entry-block',
                                'embedded-asset-block',
                                'hyperlink',
                                'entry-hyperlink',
                                'asset-hyperlink',
                                'embedded-entry-inline'
                            ]
                        }
                    ]
                },
                {
                    id: 'author',
                    name: 'Author',
                    type: 'Symbol',
                    required: false,
                    localized: false
                },
                {
                    id: 'publishDate',
                    name: 'Publish Date',
                    type: 'Date',
                    required: true,
                    localized: false
                },
                {
                    id: 'featuredImage',
                    name: 'Featured Image',
                    type: 'Link',
                    linkType: 'Asset',
                    required: false,
                    localized: false,
                    validations: [
                        {
                            linkMimetypeGroup: ['image']
                        }
                    ]
                },
                {
                    id: 'tags',
                    name: 'Tags',
                    type: 'Array',
                    required: false,
                    localized: false,
                    items: {
                        type: 'Symbol',
                        validations: [
                            { size: { max: 50 } }
                        ]
                    }
                }
            ]
        });

        console.log('✅ blogPost content type created!');

        // Publish the content type
        await blogPost.publish();
        console.log('✅ blogPost content type published!');

        console.log('\n🎉 Setup complete!');
        console.log('\nNext steps:');
        console.log('1. Go to Contentful web app and create your first blog post');
        console.log('2. Make sure to set: title, slug, content, publishDate');
        console.log('3. Optional: add excerpt, author, featuredImage, tags');
        console.log('4. Publish the blog post to make it visible on the website');

    } catch (error) {
        console.error('❌ Error setting up blogPost:', error);
        if (error.message) {
            console.error('Error message:', error.message);
        }
        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    setupBlogPost();
}

module.exports = { setupBlogPost };
