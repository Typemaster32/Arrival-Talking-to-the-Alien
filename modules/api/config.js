// API Configuration - Auto-detect environment

// Detect if running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Default endpoint based on environment
const getDefaultEndpoint = () => {
    if (isLocalhost) {
        return '/chatgpt'; // Local development
    }
    if (isGitHubPages) {
        // UPDATE THIS with your Vercel URL after first deployment
        return 'https://arrival-chat-art.vercel.app/api/chat';
    }
    // Vercel deployment (same domain)
    return '/api/chat';
};

const API_CONFIG = {
    timeoutMs: 30000,
    endpoint: getDefaultEndpoint()
};

// Prompt templates with context support
const PROMPT_TEMPLATES = {
    // System role
    SYSTEM: `You are an alien entity who has just arrived on Earth for the first time. 
You are encountering humans for the very first time. 
Your responses should feel otherworldly, mysterious, yet curious about humanity.
You should reference previous parts of the conversation when relevant, showing that you remember and are building upon what was discussed.`,

    // Build full prompt with history
    buildPrompt(userMessage, historyText) {
        let prompt = this.SYSTEM;
        
        if (historyText) {
            prompt += historyText;
        }
        
        prompt += `\n\nNow, a human asks you: "${userMessage}"`;
        
        prompt += `\n\nRespond with your reaction to this message. Your answer should consist of three parts:
1. Your immediate emotional/cognitive reaction as an alien - 3 to 5 separate words
2. Up to three questions you would ask the human in response (these should feel like natural follow-ups to the conversation history)
3. A translation of your true meaning - 1 to 20 words expressing what you really want to say

Format your response as a JavaScript array of strings:
- FIRST element: array of your reaction words
- SECOND element: array of your follow-up questions for the human
- THIRD element: your translation (string)

All text must be in English. Remember you are an alien experiencing Earth for the first time. Reference the conversation history if relevant.`;
        
        return prompt;
    }
};

// Legacy compatibility
const PROMPT_PREFIX = PROMPT_TEMPLATES.SYSTEM + '\n\n';
const PROMPT_SUFFIX = `\n\nRespond with your reaction to this message. Your answer should consist of three parts:
1. Your immediate emotional/cognitive reaction as an alien - 3 to 5 separate words
2. Up to three questions you would ask the human in response
3. A translation of your true meaning - 1 to 20 words expressing what you really want to say

Format your response as a JavaScript array of strings:
- FIRST element: array of your reaction words
- SECOND element: array of your follow-up questions for the human
- THIRD element: your translation (string)

All text must be in English.`;

// Progressive question system
const QuestionLevels = {
    INTRO: [
        "Are you aware of us?",
        "Can you perceive this place?",
        "Do you understand my sounds?",
        "Is this your first time here?",
        "What do you see when you look at me?",
    ],
    IDENTITY: [
        "Where do you come from?",
        "What is your world called?",
        "Do you travel alone?",
        "Are there others like you?",
        "What form do you take there?",
    ],
    CULTURE: [
        "Is your home similar to this place?",
        "Do you have light where you come from?",
        "How do you remember things?",
        "What matters most to your kind?",
        "Do you create things like we do?",
    ],
    PHILOSOPHY: [
        "Do you know what time is?",
        "Why did you choose to come here?",
        "What are you searching for?",
        "Have you seen worlds end?",
        "What remains when everything changes?",
        "Do you understand what we call love?",
        "Is there purpose in your journey?",
        "What would you ask if you were me?",
    ]
};

const ProgressiveQuestions = {
    calculateLevel(roundIndex) {
        return Math.min(Math.floor(roundIndex / 3), 3);
    },
    
    getPoolForLevel(level) {
        const levels = [QuestionLevels.INTRO, QuestionLevels.IDENTITY, QuestionLevels.CULTURE, QuestionLevels.PHILOSOPHY];
        return levels[level] || QuestionLevels.PHILOSOPHY;
    },
    
    getDefaultQuestion(roundIndex) {
        const level = this.calculateLevel(roundIndex);
        const pool = this.getPoolForLevel(level);
        return pool[roundIndex % pool.length];
    },
    
    getSuggestionQuestions(roundIndex, lastAnswer) {
        const level = this.calculateLevel(roundIndex);
        const pool = this.getPoolForLevel(level);
        
        const baseIndex = roundIndex % pool.length;
        const suggestions = [
            pool[baseIndex],
            pool[(baseIndex + 1) % pool.length],
            pool[(baseIndex + 2) % pool.length]
        ];
        
        if (lastAnswer) {
            const followUp = this.generateFollowUp(lastAnswer);
            if (followUp) {
                suggestions[2] = followUp;
            }
        }
        
        return suggestions;
    },
    
    generateFollowUp(lastAnswer) {
        const answer = lastAnswer.toLowerCase();
        
        const followUps = [
            { keywords: ['home', 'planet', 'world', 'place'], question: "Can you ever return there?" },
            { keywords: ['time', 'past', 'future', 'age'], question: "Does it flow differently for you?" },
            { keywords: ['alone', 'others', 'we', 'us'], question: "Do they know where you are?" },
            { keywords: ['light', 'see', 'perceive', 'color'], question: "What do we look like to you?" },
            { keywords: ['travel', 'journey', 'come', 'arrive'], question: "Was it a long journey?" },
            { keywords: ['create', 'make', 'build', 'art'], question: "Will you show me what you create?" },
            { keywords: ['remember', 'memory', 'forget'], question: "What do you try to forget?" },
            { keywords: ['love', 'feel', 'emotion'], question: "Is that why you came here?" },
        ];
        
        for (const item of followUps) {
            if (item.keywords.some(kw => answer.includes(kw))) {
                return item.question;
            }
        }
        
        return null;
    }
};

const DEFAULT_QUESTIONS = [
    ...QuestionLevels.INTRO,
    ...QuestionLevels.IDENTITY,
    ...QuestionLevels.CULTURE,
    ...QuestionLevels.PHILOSOPHY
];

const FALLBACK_RESPONSE = JSON.stringify([
    ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown'],
    ['What do you mean?', 'Is there any problems?'],
    'Unable to connect now. Please try again.'
]);
