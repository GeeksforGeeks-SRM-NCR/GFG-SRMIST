const contentful = require('contentful-management');
require('dotenv').config();

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_PAT || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT_ID = 'master';

if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error('Missing Contentful configuration.');
    process.exit(1);
}

const client = contentful.createClient({
    accessToken: ACCESS_TOKEN,
});

const SAMPLES = [
    {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        description: {
            nodeType: 'document',
            data: {},
            content: [
                {
                    nodeType: 'paragraph',
                    data: {},
                    content: [
                        {
                            nodeType: 'text',
                            value: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
                            marks: [],
                            data: {}
                        }
                    ]
                },
                {
                    nodeType: 'paragraph',
                    data: {},
                    content: [
                        { nodeType: 'text', value: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.', marks: [], data: {} }
                    ]
                }
            ]
        },
        starterCode: {
            javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n  \n};`,
            python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
            cpp: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
        },
        testCases: [
            { input: "2 7 11 15\n9", output: "[0, 1]" },
            { input: "3 2 4\n6", output: "[1, 2]" },
            { input: "3 3\n6", output: "[0, 1]" }
        ]
    },
    {
        title: 'Palindrome Number',
        slug: 'palindrome-number',
        difficulty: 'Easy',
        description: {
            nodeType: 'document',
            data: {},
            content: [{ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.', marks: [], data: {} }] }]
        },
        starterCode: {
            javascript: `/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n  \n};`,
            python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass`,
            cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};`
        },
        testCases: [
            { input: "121", output: "true" },
            { input: "-121", output: "false" },
            { input: "10", output: "false" }
        ]
    },
    {
        title: 'Reverse String',
        slug: 'reverse-string',
        difficulty: 'Easy',
        description: {
            nodeType: 'document',
            data: {},
            content: [{ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.', marks: [], data: {} }] }]
        },
        starterCode: {
            javascript: `/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n  \n};`,
            python: `class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        """\n        Do not return anything, modify s in-place instead.\n        """\n        pass`
        },
        testCases: [
            { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ]
    },
    {
        title: 'Fizz Buzz',
        slug: 'fizz-buzz',
        difficulty: 'Easy',
        description: {
            nodeType: 'document',
            data: {},
            content: [{ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Given an integer n, return a string array answer (1-indexed) where answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if i is divisible by 3, "Buzz" if i is divisible by 5, or i as a string otherwise.', marks: [], data: {} }] }]
        },
        starterCode: {
            javascript: `/**\n * @param {number} n\n * @return {string[]}\n */\nvar fizzBuzz = function(n) {\n  \n};`,
            python: `class Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        pass`
        },
        testCases: [
            { input: "3", output: '["1","2","Fizz"]' },
            { input: "5", output: '["1","2","Fizz","4","Buzz"]' }
        ]
    },
    {
        title: 'Valid Anagram',
        slug: 'valid-anagram',
        difficulty: 'Easy',
        description: {
            nodeType: 'document',
            data: {},
            content: [{ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', marks: [], data: {} }] }]
        },
        starterCode: {
            javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n  \n};`,
            python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass`
        },
        testCases: [
            { input: '"anagram"\n"nagaram"', output: "true" },
            { input: '"rat"\n"car"', output: "false" }
        ]
    }
];

async function run() {
    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(ENVIRONMENT_ID);

        for (const sample of SAMPLES) {
            console.log(`Processing problem: ${sample.title}`);

            let entry;
            try {
                // Check if exists
                const entries = await environment.getEntries({
                    content_type: 'codingProblem',
                    'fields.slug.en-US': sample.slug
                });

                if (entries.items.length > 0) {
                    entry = entries.items[0];
                    console.log(`Updating existing entry for ${sample.title}...`);

                    entry.fields.title['en-US'] = sample.title;
                    entry.fields.difficulty['en-US'] = sample.difficulty;
                    entry.fields.description['en-US'] = sample.description;
                    entry.fields.starterCode['en-US'] = sample.starterCode;
                    entry.fields.testCases['en-US'] = sample.testCases;

                    entry = await entry.update();
                } else {
                    console.log(`Creating new entry for ${sample.title}...`);
                    entry = await environment.createEntry('codingProblem', {
                        fields: {
                            title: { 'en-US': sample.title },
                            slug: { 'en-US': sample.slug },
                            difficulty: { 'en-US': sample.difficulty },
                            description: { 'en-US': sample.description },
                            starterCode: { 'en-US': sample.starterCode },
                            testCases: { 'en-US': sample.testCases }
                        }
                    });
                }

                if (!entry.isPublished()) {
                    await entry.publish();
                    console.log(`Published ${sample.title}.`);
                } else {
                    // Needs republishing after update
                    if (entry.sys.version > (entry.sys.publishedVersion || 0) + 1) { // Basic check
                        await entry.publish();
                        console.log(`Published update for ${sample.title}.`);
                    }
                    // Actually logic for republishing is:
                    await entry.publish();
                    console.log(`Republished ${sample.title}.`);
                }

            } catch (e) {
                console.error(`Failed to process ${sample.title}:`, e);
            }
        }

        console.log('Seed completed!');
    } catch (error) {
        console.error('Error seeding:', error);
    }
}

run();
