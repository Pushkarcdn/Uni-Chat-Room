import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Messages = mongoose.models.Messages || mongoose.model("Message", messageSchema);

export default Messages;
