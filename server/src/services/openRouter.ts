// Thin wrapper around OpenRouter's chat completions API. Uses global
// fetch (Node 18+) rather than adding an SDK dependency — OpenRouter is
// just an OpenAI-compatible REST endpoint, no client library needed.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Any OpenRouter model slug works — see https://openrouter.ai/models.
// Defaulting to a cheap, fast, capable-enough model for structured MCQ
// generation; override via env without a code change if you want a
// stronger/cheaper alternative.
const DEFAULT_MODEL = "openai/gpt-4o-mini";

interface ChatCompletionResult {
  content: string;
}

export const requestChatCompletion = async ({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string;
  userPrompt: string;
}): Promise<ChatCompletionResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // OpenRouter uses these purely for its own leaderboard/analytics
      // attribution — optional, but good practice to send.
      "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
      "X-Title": "Quiz Blitz",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      // Not every model on OpenRouter honors this, but it costs nothing
      // to ask — the prompt itself also spells out the exact JSON shape
      // as a fallback for models that ignore response_format.
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter request failed (${response.status}): ${body.slice(0, 300)}`,
    );
  }

  interface OpenRouterResponse {
    choices?: { message?: { content?: string } }[];
  }

  const data = (await response.json()) as OpenRouterResponse;
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("OpenRouter returned an empty response");
  }

  return { content };
};