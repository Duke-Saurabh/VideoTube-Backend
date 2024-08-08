import mongoose from "mongoose";
import { User } from "./users.modals.js";

const commentSchema = new mongoose.Schema({
    From: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    To: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    Message: {
        sendByChannelUserName: {
            type: String,
            required: true
        },
        receivedByChannelUserName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
