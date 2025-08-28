import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: [true, "Contest ID is required"],
        },

        questionText: {
            type: String,
            required: [true, "Question text is required"],
            trim: true,
            maxLength: [500, "Question cannot exceed 500 characters"],
        },

        options: [
            {
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
            },
        ],
    },
    {
        timestamps: true,
    }
);


const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;