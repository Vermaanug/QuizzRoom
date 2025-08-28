import mongoose from "mongoose";
import crypto from "crypto";

const contestSchema = new mongoose.Schema(
  {
    contestName: {
      type: String,
      required: [true, "Contest name is required"],
      trim: true,
      maxLength: [100, "Contest name cannot exceed 100 characters"],
      minLength: [3, "Contest name must be at least 3 characters"],
    },
    numberOfQuestions: {
      type: Number,
      required: [true, "Number of questions is required"],
      min: [5, "Minimum 5 questions required"],
      max: [20, "Maximum 20 questions allowed"],
    },
    totalParticipants: {
      type: Number,
      required: [true, "Total participants is required"],
      min: [1, "At least 1 participant required"],
      max: [50, "Maximum 50 participants allowed"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "ready", "active", "completed"],
        message: "Status must be one of: draft, ready, active, completed",
      },
      default: "draft",
    },
    shareableLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    questionsAdded: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);


const ContestModel = mongoose.model("Contest", contestSchema);

export default ContestModel;
