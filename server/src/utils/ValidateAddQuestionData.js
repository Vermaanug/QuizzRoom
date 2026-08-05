import validator from "validator";

const ValidateAddQuestionData = (req) => {
  const { questions } = req.body;

  let errors = {};

  for (let i = 0; i < questions.length; i++) {
    const eachQuestion = questions[i];

    if (
      !eachQuestion?.questionText ||
      validator.isEmpty(eachQuestion.questionText.trim())
    ) {
      errors[`question_${i}`] = "Question text is required";
    }

    if (
      !Array.isArray(eachQuestion?.options) ||
      eachQuestion.options.length !== 4
    ) {
      
      errors[`options_${i}`] = "Each question must have exactly 4 options";

    } else {

      eachQuestion.options.forEach((opt, j) => {
        if (!opt?.text || validator.isEmpty(opt.text.trim())) {
          errors[`question_${i}_option_${j}`] = "Option text is required";
        }
      });

      const correctCount = eachQuestion.options.filter(
        (opt) => opt.isCorrect === true
      ).length;

      if (correctCount === 0) {
        errors[`correctAnswer_${i}`] =
          "At least one option must be marked as correct";
      } else if (correctCount > 1) {
        errors[`correctAnswer_${i}`] =
          "Only one option can be marked as correct for this question";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default ValidateAddQuestionData;
