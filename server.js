require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '15000', 10);
const DEEPSEEK_API_BASE_URL = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_CHAT_MODEL = process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat';
const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';


app.use(express.json({ limit: '32kb' }));
app.use(cors()); // Enable CORS for all routes
app.use(express.static(path.join(__dirname)));
app.use((req, res, next) => {
    req.requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    res.setHeader('X-Request-Id', req.requestId);
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, service: 'arrival-chat', requestId: req.requestId });
});

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callProvider({ name, apiKey, baseUrl, model, message }) {
    if (!apiKey) {
        throw new Error(`${name}: missing API key`);
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: message }]
        })
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : { raw: await response.text() };

    if (!response.ok) {
        const msg = data?.error?.message || data?.raw || `${name}: request failed`;
        throw new Error(msg);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
        throw new Error(`${name}: invalid response payload`);
    }

    return text;
}

app.post('/chatgpt', async (req, res) => {
    const startedAt = Date.now();
    const reqId = req.requestId;
    const userMessage = req.body.message;

    try {
        if (typeof userMessage !== 'string' || userMessage.trim().length === 0) {
            return res.status(400).send('message must be a non-empty string');
        }
        if (userMessage.length > 5000) {
            return res.status(413).send('message is too long');
        }
        if (!DEEPSEEK_API_KEY && !OPENAI_API_KEY) {
            throw new Error('Missing DEEPSEEK_API_KEY and OPENAI_API_KEY');
        }

        try {
            const deepseekText = await callProvider({
                name: 'deepseek',
                apiKey: DEEPSEEK_API_KEY,
                baseUrl: DEEPSEEK_API_BASE_URL,
                model: DEEPSEEK_CHAT_MODEL,
                message: userMessage
            });
            console.log(`[${reqId}] provider=deepseek model=${DEEPSEEK_CHAT_MODEL} ms=${Date.now() - startedAt}`);
            return res.send(deepseekText);
        } catch (deepseekError) {
            console.warn(`[${reqId}] DeepSeek failed, fallback to OpenAI: ${deepseekError.message}`);
        }

        const openaiText = await callProvider({
            name: 'openai',
            apiKey: OPENAI_API_KEY,
            baseUrl: OPENAI_API_BASE_URL,
            model: OPENAI_CHAT_MODEL,
            message: userMessage
        });
        console.log(`[${reqId}] provider=openai model=${OPENAI_CHAT_MODEL} ms=${Date.now() - startedAt}`);
        res.send(openaiText);
    } catch (error) {
        console.error(`[${reqId}] Error:`, error.message);
        res.status(502).send('Error processing your request');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
