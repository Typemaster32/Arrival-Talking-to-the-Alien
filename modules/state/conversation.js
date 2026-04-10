// Conversation state management with memory

const ConversationState = {
    // Current question/answer
    humanQuestion: 'This is a test',
    alienAnswer: '',
    translation: '',
    reactionWords: [],
    followUpQuestions: [],
    
    // Response data
    rawResponse: null,
    parsedResponse: null,
    
    // UI display strings
    humanNoteText: '',
    alienNoteText: '',
    predictionsText: '',
    
    // Memory: 保存最近 3 轮对话
    history: [],
    maxHistory: 3,
    
    // 当前轮数（用于决定问题层级）
    roundIndex: 0,
    
    // Set human question
    setQuestion(question) {
        this.humanQuestion = question;
    },
    
    // Set response from API
    setResponse(rawResponse, parsedResponse) {
        this.rawResponse = rawResponse;
        this.parsedResponse = parsedResponse;
        
        if (parsedResponse && parsedResponse.length >= 3) {
            this.reactionWords = parsedResponse[0];
            this.followUpQuestions = parsedResponse[1];
            this.alienAnswer = parsedResponse[2];
            
            // Build predictions text
            this.predictionsText = this.followUpQuestions.join(' / ');
        }
        
        // 保存到历史
        this.addToHistory();
        this.roundIndex++;
    },
    
    // 添加当前轮次到历史
    addToHistory() {
        if (this.humanQuestion && this.alienAnswer) {
            this.history.push({
                human: this.humanQuestion,
                alien: this.alienAnswer,
                reaction: this.reactionWords
            });
            
            // 只保留最近 maxHistory 轮
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }
    },
    
    // 获取格式化的对话历史（用于 Prompt 注入）
    getFormattedHistory() {
        if (this.history.length === 0) return '';
        
        let formatted = '\n\n[Previous conversation]:\n';
        this.history.forEach((entry, index) => {
            formatted += `Round ${index + 1}:\n`;
            formatted += `Human asked: "${entry.human}"\n`;
            formatted += `You responded: "${entry.alien}"\n\n`;
        });
        
        return formatted;
    },
    
    // 获取上一轮信息（用于生成追问）
    getLastExchange() {
        if (this.history.length === 0) return null;
        return this.history[this.history.length - 1];
    },
    
    // 获取当前轮数
    getRoundIndex() {
        return this.roundIndex;
    },
    
    // 获取格式化的 reaction words
    getReactionWordsString() {
        return JSON.stringify(this.reactionWords);
    },
    
    // Reset conversation state
    reset() {
        this.humanQuestion = '';
        this.alienAnswer = '';
        this.translation = '';
        this.reactionWords = [];
        this.followUpQuestions = [];
        this.rawResponse = null;
        this.parsedResponse = null;
        this.history = [];
        this.roundIndex = 0;
    }
};
