import { Request, Response, NextFunction } from "express";
import { User, Quiz } from "@prisma/client";

// Express request with user attached by auth middleware
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// API response wrapper type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: Record<string, string>;
}

// Request handlers
export type RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
) => Promise<any> | any;

export type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
) => Promise<void | any>;

export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Auth related types
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Quiz related types
export interface CreateQuizRequest {
  title: string;
  status?: "draft" | "published" | "archived";
}

export interface UpdateQuizRequest {
  title?: string;
  status?: "draft" | "published" | "archived";
}

// User model types (mapped user)
export interface MappedUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz model types (mapped quiz)
export interface MappedQuiz {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  questionCount: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CorrectOption = "A" | "B" | "C" | "D";
export type QuestionTimeLimit = 30 | 60;

export interface QuestionInput {
  id?: string;
  text: string;
  codeSnippet?: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: CorrectOption;
  timeLimitSeconds: QuestionTimeLimit;
}

export interface MappedQuestion {
  id: string;
  quizId: string;
  text: string;
  codeSnippet: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: CorrectOption;
  timeLimitSeconds: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

