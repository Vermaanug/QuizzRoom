import ContestModal from "../model/ContestModal.js";
import ValidateCreateContestData from "../utils/ValidateCreateContestData.js";

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

    console.log(newContest);

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
