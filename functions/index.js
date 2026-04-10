/**
 * Arrival Chat API - Firebase Functions (2nd gen)
 * DeepSeek primary, OpenAI fallback
 */

const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const fetch = require("node-fetch");
const cors = require("cors")({origin: true});

// Secrets from Firebase Secret Manager
const deepseekApiKey = defineSecret("DEEPSEEK_API_KEY");
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Configuration
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const DEEPSEEK_API_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_CHAT_MODEL = "deepseek-chat";
const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
const OPENAI_CHAT_MODEL = "gpt-4o-mini";

/**
 * Call LLM provider
 */
async function callProvider({name, apiKey, baseUrl, model, message}) {
  if (!apiKey) {
    throw new Error(`${name}: missing API key`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{role: "user", content: message}],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : {raw: await response.text()};

    if (!response.ok) {
      const msg = data?.error?.message || data?.raw || `${name}: request failed`;
      throw new Error(msg);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error(`${name}: invalid response payload`);
    }

    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Main chat endpoint
 * POST /chatgpt - Send chat message
 * GET /chatgpt or /health - Health check
 */
exports.chatgpt = onRequest(
  {
    secrets: [deepseekApiKey, openaiApiKey],
    timeoutSeconds: 180, // 3 minutes timeout for LLM calls
    memory: "256MiB",
    cors: true,
  },
  async (req, res) => {
    const reqId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    res.setHeader("X-Request-Id", reqId);

    // Health check
    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        service: "arrival-chat",
        requestId: reqId,
      });
    }

    // Only accept POST for chat
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const startedAt = Date.now();
    const userMessage = req.body?.message;

    try {
      // Input validation
      if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
        return res.status(400).send("message must be a non-empty string");
      }
      if (userMessage.length > 5000) {
        return res.status(413).send("message is too long");
      }

      // Try DeepSeek first
      try {
        const deepseekText = await callProvider({
          name: "deepseek",
          apiKey: deepseekApiKey.value(),
          baseUrl: DEEPSEEK_API_BASE_URL,
          model: DEEPSEEK_CHAT_MODEL,
          message: userMessage,
        });
        console.log(`[${reqId}] provider=deepseek model=${DEEPSEEK_CHAT_MODEL} ms=${Date.now() - startedAt}`);
        return res.send(deepseekText);
      } catch (deepseekError) {
        console.warn(`[${reqId}] DeepSeek failed, fallback to OpenAI: ${deepseekError.message}`);
      }

      // Fallback to OpenAI
      const openaiText = await callProvider({
        name: "openai",
        apiKey: openaiApiKey.value(),
        baseUrl: OPENAI_API_BASE_URL,
        model: OPENAI_CHAT_MODEL,
        message: userMessage,
      });
      console.log(`[${reqId}] provider=openai model=${OPENAI_CHAT_MODEL} ms=${Date.now() - startedAt}`);
      return res.send(openaiText);
    } catch (error) {
      console.error(`[${reqId}] Error:`, error.message);
      return res.status(502).send("Error processing your request");
    }
  }
);
