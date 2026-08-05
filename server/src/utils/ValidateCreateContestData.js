import validator from "validator";

const ValidateCreateContestData = (req) => {
    const { contestName, numberOfQuestions, totalParticipants, status } = req.body;

    let errors = {};

    if (!contestName || validator.isEmpty(contestName.trim())) {
        errors.contestName = "Contest name is required";
    }


    if (!numberOfQuestions) {
        errors.numberOfQuestions = "Number of questions is required";
    } else if (!validator.isInt(numberOfQuestions.toString(), { min: 5, max: 20 })) {
        errors.numberOfQuestions = "Number of questions must be between 5 and 20";
    }

    if (!totalParticipants) {
        errors.totalParticipants = "Total participants is required";
    } else if (!validator.isInt(totalParticipants.toString(), { min: 1, max: 50 })) {
        errors.totalParticipants = "Total participants must be between 1 and 50";
    }

    const allowedStatus = ["draft", "ready", "active", "completed"];
    if (status && !allowedStatus.includes(status.toLowerCase())) {
        errors.status = "Status must be one of: draft, ready, active, completed";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default ValidateCreateContestData;
