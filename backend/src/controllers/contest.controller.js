import ContestModal from "../model/ContestModal.js";
import ValidateCreateContestData from "../utils/ValidateCreateContestData.js";
import ValidateAddQuestionData from "../utils/ValidateAddQuestionData.js"
import QuestionModel from "../model/QuestionModel.js";

export const createContest = async (req, res) => {
  try {
    const { isValid, errors } = ValidateCreateContestData(req);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "InValid Data",
        errors,
      });
    }

    const { contestName, numberOfQuestions, totalParticipants, status } =
      req.body;

    const createdBy = req.user?._id;

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const newContest = new ContestModal({
      contestName,
      numberOfQuestions,
      totalParticipants,
      status,
      createdBy,
    });

    await newContest.save();

    return res.status(201).json({
      success: true,
      message: "Contest created successfully",
      contest: newContest,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const addQuestions = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide Contest ID",
      });
    }

    const contest = await ContestModal.findById(id);
    if (!contest) {
      return res.status(400).json({
        success: false,
        message: "Contest does not exist",
      });
    }

    const { questions } = req.body;
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required",
      });
    }


    if (contest.numberOfQuestions !== questions.length) {
      return res.status(400).json({
        success: false,
        message: `Please provide exactly ${contest.numberOfQuestions} questions`,
      });
    }


    const { isValid, errors } = ValidateAddQuestionData(req);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors,
      });
    }


    const newQuestions = new QuestionModel({
      contestId: id,
      questions,
    });

    await newQuestions.save();


    contest.status = "ready";
    await contest.save();

    return res.status(201).json({
      success: true,
      message: "Questions added successfully",
      questions,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
