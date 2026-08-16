export type TimeLimit = 30 | 60

export type CorrectOption = "A" | "B" | "C" | "D";

export interface QuestionInput {
  id?: string; 
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: CorrectOption;
  timeLimitSeconds: TimeLimit;
}
 
export interface QuizEditorFormValues {
  questions: QuestionInput[];
}
