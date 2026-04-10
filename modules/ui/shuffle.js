// Shuffle utility and progressive question system

/**
 * Shuffle and select 3 unique questions from default questions
 * Excludes current index and currently displayed questions to avoid repetition
 * 
 * @param {Array} defaultQuestions - Source question array
 * @param {number} currentIndex - Current collection index to exclude
 * @param {string} currentA - Current option A text to exclude
 * @param {string} currentB - Current option B text to exclude  
 * @param {string} currentC - Current option C text to exclude
 * @returns {Array} - Array of 3 selected questions
 */
function shuffleABC(defaultQuestions, currentIndex, currentA, currentB, currentC) {
    // Create a copy and remove current index item
    let pool = defaultQuestions.slice();
    pool.splice(currentIndex, 1);
    
    // Filter out currently displayed questions
    pool = pool.filter(item => item !== currentA);
    pool = pool.filter(item => item !== currentB);
    pool = pool.filter(item => item !== currentC);
    
    // Select 3 random items
    const selected = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(random(pool.length));
        selected.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
    }
    
    return selected;
}

/**
 * Get questions with follow-up feel based on conversation progress
 * Uses ProgressiveQuestions system
 * 
 * @param {number} roundIndex - Current conversation round
 * @param {string} lastAnswer - Previous alien answer (for follow-up generation)
 * @param {string} currentA - Current option A
 * @param {string} currentB - Current option B
 * @param {string} currentC - Current option C
 * @returns {Array} - Array of 3 questions
 */
function getProgressiveQuestions(roundIndex, lastAnswer, currentA, currentB, currentC) {
    // Get suggestions from ProgressiveQuestions system
    let suggestions = ProgressiveQuestions.getSuggestionQuestions(roundIndex, lastAnswer);
    
    // Filter out currently displayed questions
    suggestions = suggestions.filter(q => q !== currentA && q !== currentB && q !== currentC);
    
    // If filtered too much, fill from pool
    if (suggestions.length < 3) {
        const level = ProgressiveQuestions.calculateLevel(roundIndex);
        const pool = ProgressiveQuestions.getPoolForLevel(level);
        const extras = pool.filter(q => 
            q !== currentA && q !== currentB && q !== currentC && !suggestions.includes(q)
        );
        while (suggestions.length < 3 && extras.length > 0) {
            suggestions.push(extras.shift());
        }
    }
    
    return suggestions.slice(0, 3);
}

/**
 * Get random bounding box positions for visual elements
 * @returns {Array} - Array of [angle, size] pairs
 */
function generateBoundingBoxes(radius) {
    const boxes = [];
    let startBBox = 0;
    
    for (let i = 0; i < 5; i++) {
        const angle = random(startBBox, (2 * PI * (1 + i)) / 5);
        const size = random(radius * 0.28, radius * 0.34);
        boxes.push([angle, size]);
        startBBox = angle;
    }
    
    return boxes;
}

/**
 * Get default question for passive talk (auto-trigger)
 * @param {number} roundIndex - Current round
 * @returns {string} - Default question
 */
function getDefaultQuestion(roundIndex) {
    return ProgressiveQuestions.getDefaultQuestion(roundIndex);
}
