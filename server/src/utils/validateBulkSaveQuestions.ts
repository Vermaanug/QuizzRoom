import { Request } from "express";
import { ValidationResult } from "../types/index.js";

const correctOptions = new Set(["A", "B", "C", "D"]);
const timeLimits = new Set([30, 60]);

const validateBulkSaveQuestions = (req: Request): ValidationResult => {
  const { questions } = req.body;

  const errors: Record<string, string> = {};

  if (!Array.isArray(questions)) {
    errors.questions = "questions must be an array";
    return { isValid: false, errors };
  }

  questions.forEach((question, index) => {
    const prefix = `questions.${index}`;

    if (question.id !== undefined && typeof question.id !== "string") {
      errors[`${prefix}.id`] = "id must be a string";
    }

    if (!String(question.text ?? "").trim()) {
      errors[`${prefix}.text`] = "text is required";
    }

    if (
      question.codeSnippet !== undefined &&
      question.codeSnippet !== null &&
      typeof question.codeSnippet !== "string"
    ) {
      errors[`${prefix}.codeSnippet`] = "codeSnippet must be a string";
    }

    (["optionA", "optionB", "optionC", "optionD"] as const).forEach((optionKey) => {
      if (!String(question[optionKey] ?? "").trim()) {
        errors[`${prefix}.${optionKey}`] = `${optionKey} is required`;
      }
    });

    if (!correctOptions.has(String(question.correctOption))) {
      errors[`${prefix}.correctOption`] = "correctOption must be one of A, B, C, D";
    }

    if (!timeLimits.has(Number(question.timeLimitSeconds))) {
      errors[`${prefix}.timeLimitSeconds`] = "timeLimitSeconds must be 30 or 60";
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateBulkSaveQuestions;