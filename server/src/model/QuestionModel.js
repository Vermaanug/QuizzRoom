import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Option text is required"],
    trim: true,
    maxLength: [200, "Option cannot exceed 200 characters"],
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: [true, "Contest ID is required"],
    },

    questions: [
      {
        questionText: {
          type: String,
          required: [true, "Question text is required"],
          trim: true,
          maxLength: [500, "Question cannot exceed 500 characters"],
        },
        options: {
          type: [optionSchema],
          validate: {
            validator: function (val) {
              return val.length === 4;
            },
            message: "Each question must have exactly 4 options",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;
