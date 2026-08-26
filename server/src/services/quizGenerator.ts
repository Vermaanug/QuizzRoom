import { requestChatCompletion } from "./openRouter.js";
import type { CorrectOption, QuestionInput, QuestionTimeLimit } from "../types/index.js";

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 30; // sanity ceiling — protects against a typo'd huge count burning tokens

const VALID_OPTIONS: CorrectOption[] = ["A", "B", "C", "D"];
const VALID_TIME_LIMITS: QuestionTimeLimit[] = [30, 60];

const buildSystemPrompt = () => `You are a quiz-writing assistant. You output ONLY strict JSON, no markdown, no commentary, no code fences.

The JSON shape must be exactly:
{
  "questions": [
    {
      "text": "the question text",
      "codeSnippet": null,
      "optionA": "answer choice A",
      "optionB": "answer choice B",
      "optionC": "answer choice C",
      "optionD": "answer choice D",
      "correctOption": "A",
      "timeLimitSeconds": 30
    }
  ]
}

Rules:
- correctOption must be exactly one of "A", "B", "C", "D".
- timeLimitSeconds must be exactly 30 or 60 (30 for quick factual questions, 60 for anything requiring reading/reasoning, e.g. a code snippet).
- codeSnippet must be null unless the question genuinely requires showing code to answer it — if used, keep it short (under ~10 lines).
- Exactly four distinct, plausible options per question. Only one is correct.
- Do not number the questions or options yourself — that's handled by the app.
- Return ONLY the JSON object. No prose before or after it.`;

const buildUserPrompt = (prompt: string, count: number) =>
  `Generate exactly ${count} multiple-choice quiz questions about: ${prompt}

Return exactly ${count} items in the "questions" array — no more, no fewer.`;

const stripCodeFences = (raw: string) =>
  raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

// Coerces a model's timeLimitSeconds to the nearest allowed value rather
// than rejecting the whole question over a minor format slip (e.g. the
// model returning 45 instead of picking 30 or 60).
const coerceTimeLimit = (value: unknown): QuestionTimeLimit => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 30;
  return Math.abs(num - 60) < Math.abs(num - 30) ? 60 : 30;
};

const validateQuestion = (raw: any): QuestionInput | null => {
  if (!raw || typeof raw !== "object") return null;

  const { text, codeSnippet, optionA, optionB, optionC, optionD, correctOption } = raw;

  if (
    !isNonEmptyString(text) ||
    !isNonEmptyString(optionA) ||
    !isNonEmptyString(optionB) ||
    !isNonEmptyString(optionC) ||
    !isNonEmptyString(optionD)
  ) {
    return null;
  }

  const normalizedCorrectOption = String(correctOption).trim().toUpperCase();
  if (!VALID_OPTIONS.includes(normalizedCorrectOption as CorrectOption)) {
    return null;
  }

  return {
    text: text.trim(),
    codeSnippet: isNonEmptyString(codeSnippet) ? codeSnippet.trim() : null,
    optionA: optionA.trim(),
    optionB: optionB.trim(),
    optionC: optionC.trim(),
    optionD: optionD.trim(),
    correctOption: normalizedCorrectOption as CorrectOption,
    timeLimitSeconds: coerceTimeLimit(raw.timeLimitSeconds),
  };
};

export const generateQuizQuestions = async (
  prompt: string,
  requestedCount: number,
): Promise<QuestionInput[]> => {
  const count = Math.min(Math.max(requestedCount, MIN_QUESTIONS), MAX_QUESTIONS);

  const { content } = await requestChatCompletion({
    systemPrompt: buildSystemPrompt(),
    userPrompt: buildUserPrompt(prompt, count),
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFences(content));
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  const rawQuestions = (parsed as any)?.questions;
  if (!Array.isArray(rawQuestions)) {
    throw new Error("AI response did not contain a questions array");
  }

  const validQuestions = rawQuestions
    .map(validateQuestion)
    .filter((q): q is QuestionInput => q !== null)
    .slice(0, count);

  // Require at least half of what was asked for — a handful of malformed
  // entries shouldn't fail the whole generation, but a mostly-broken
  // response should, rather than silently handing back a 3-question
  // "20 question quiz".
  if (validQuestions.length < Math.ceil(count / 2)) {
    throw new Error(
      `AI only returned ${validQuestions.length} usable questions out of ${count} requested`,
    );
  }

  return validQuestions;
};