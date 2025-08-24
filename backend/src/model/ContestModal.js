import mongoose from "mongoose";


const contestSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        min: 2,
        max: 30,
        match: [/^[a-zA-Z0-9 _-]+$/, "Room name can only contain letters, numbers, spaces, underscores and hyphens"],
    },
    // createdBy: {
    //     type: String,
    //     required: true,
    // },
    numberOfQuestions: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
    },
    timePerQuestion: {
        type: Number,
        required: true,
        default: 30
    },
}, { timestamps: true });

const ContestModal = mongoose.model("Contest", contestSchema);

export default ContestModal;