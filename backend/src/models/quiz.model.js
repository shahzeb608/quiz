import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [
      {
        questionText: { type: String, required: true },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: v => v.length >= 2,
            message: "Each question must have at least two options"
          }
        },
        correctAnswer: { type: String, required: true }
      }
    ],
    duration: { 
      type: Number, 
      required: true, 
      min: [1, "Duration must be at least 1 minute"]
    }
  },
  { timestamps: true }
);
export const Quiz = mongoose.model("Quiz", QuizSchema);