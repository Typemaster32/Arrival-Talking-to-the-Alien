// Progressive Question System - 追问感问题设计
// 问题分为 4 个层级，从浅入深，形成对话流

const QuestionLevels = {
    // Level 1: 初次接触 (0-2 轮) - 基础认知
    INTRO: [
        "Are you aware of us?",
        "Can you perceive this place?",
        "Do you understand my sounds?",
        "Is this your first time here?",
        "What do you see when you look at me?",
    ],
    
    // Level 2: 建立联系 (3-5 轮) - 探索身份
    IDENTITY: [
        "Where do you come from?",
        "What is your world called?",
        "Do you travel alone?",
        "Are there others like you?",
        "What form do you take there?",
    ],
    
    // Level 3: 深入理解 (6-8 轮) - 文化对比
    CULTURE: [
        "Is your home similar to this place?",
        "Do you have light where you come from?",
        "How do you remember things?",
        "What matters most to your kind?",
        "Do you create things like we do?",
    ],
    
    // Level 4: 哲学追问 (9+ 轮) - 终极思考
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

// 追问感问题生成器
const FollowUpGenerator = {
    // 基于上一条回答生成追问
    generateFollowUp(lastAnswer, lastQuestion) {
        const answer = lastAnswer.toLowerCase();
        
        // 根据回答内容的关键词生成追问
        if (answer.includes('home') || answer.includes('planet') || answer.includes('world')) {
            return [
                "Is it far from here?",
                "What do you miss about it?",
                "Can you return whenever you wish?"
            ];
        }
        
        if (answer.includes('time') || answer.includes('past') || answer.includes('future')) {
            return [
                "Does it flow the same for you?",
                "Can you see what comes next?",
                "Do you age as we do?"
            ];
        }
        
        if (answer.includes('alone') || answer.includes('others') || answer.includes('we')) {
            return [
                "Do they know you are here?",
                "Are you speaking for all of them?",
                "What would they think of us?"
            ];
        }
        
        if (answer.includes('light') || answer.includes('see') || answer.includes('perceive')) {
            return [
                "Is your light different from ours?",
                "Do you see things we cannot?",
                "What colors exist where you are?"
            ];
        }
        
        // 通用追问
        return [
            "Tell me more about that.",
            "How does that make you feel?",
            "What comes after that?"
        ];
    },
    
    // 获取当前层级的问题
    getQuestionsForLevel(level) {
        switch(level) {
            case 0: return QuestionLevels.INTRO;
            case 1: return QuestionLevels.IDENTITY;
            case 2: return QuestionLevels.CULTURE;
            case 3: return QuestionLevels.PHILOSOPHY;
            default: return QuestionLevels.PHILOSOPHY;
        }
    },
    
    // 根据轮数计算层级 (0-2:INTRO, 3-5:IDENTITY, 6-8:CULTURE, 9+:PHILOSOPHY)
    calculateLevel(roundIndex) {
        return Math.min(Math.floor(roundIndex / 3), 3);
    },
    
    // 获取当前显示的3个建议问题
    getSuggestionQuestions(currentRound, lastAnswer, lastQuestion) {
        const level = this.calculateLevel(currentRound);
        const levelQuestions = this.getQuestionsForLevel(level);
        
        // 如果有上一条回答，生成追问
        if (lastAnswer && lastQuestion) {
            const followUps = this.generateFollowUp(lastAnswer, lastQuestion);
            // 混合追问和层级问题
            return this.shuffleAndSelect([
                followUps[0],
                levelQuestions[currentRound % levelQuestions.length],
                followUps[1] || levelQuestions[(currentRound + 1) % levelQuestions.length]
            ]);
        }
        
        // 否则从当前层级选3个
        return this.shuffleAndSelect(levelQuestions);
    },
    
    // 随机选择3个不重复的问题
    shuffleAndSelect(questions) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }
};

// 为了向后兼容，保留原始 DEFAULT_QUESTIONS
const DEFAULT_QUESTIONS_ALL = [
    ...QuestionLevels.INTRO,
    ...QuestionLevels.IDENTITY,
    ...QuestionLevels.CULTURE,
    ...QuestionLevels.PHILOSOPHY
];

// 导出（保持原有变量名兼容）
const DEFAULT_QUESTIONS = DEFAULT_QUESTIONS_ALL;
