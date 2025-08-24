import ContestModal from "../model/ContestModal.js";

export const createRoom = async (req, res) => {
    try {
        const { roomName, numberOfQuestions, timePerQuestion } = req.body

        if (!roomName || !numberOfQuestions || !timePerQuestion) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRoom = new ContestModal({
            roomName,
            // createdBy: req.user._id,
            numberOfQuestions,
            timePerQuestion,
        })
        await newRoom.save();
        res.status(201).json({
            message: "Contest created successfully",
            newRoom,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            let messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });
    }
}