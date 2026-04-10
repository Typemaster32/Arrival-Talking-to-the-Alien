// API Client for chat requests with memory support

let isRequestInFlight = false;

/**
 * Send message to chat API with conversation history
 * @param {string} message - The message to send
 * @param {string} historyText - Formatted conversation history (optional)
 * @returns {Promise<string>} - The API response text
 */
async function sendChatMessage(message, historyText = '') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

    // 使用新的 prompt 构建器
    const fullMessage = PROMPT_TEMPLATES.buildPrompt(message, historyText);

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: fullMessage }),
            signal: controller.signal
        });

        const reply = await response.text();
        if (!response.ok) {
            throw new Error(reply || `Request failed with status ${response.status}`);
        }
        return reply;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Parse API response into structured array
 * @param {string} responseText - Raw API response
 * @returns {Array} - Parsed response array
 */
function parseResponse(responseText) {
    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.warn('Failed to parse response:', error);
        return [
            ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown'],
            ['What do you mean?', 'Is there any problems?'],
            'Unable to translate. Be careful.'
        ];
    }
}

/**
 * Check if a request is currently in flight
 * @returns {boolean}
 */
function getRequestInFlight() {
    return isRequestInFlight;
}

/**
 * Set request in flight status
 * @param {boolean} status
 */
function setRequestInFlight(status) {
    isRequestInFlight = status;
}

// 向后兼容：支持旧版 API（不带 history）
async function sendChatMessageLegacy(message) {
    return sendChatMessage(message, '');
}
