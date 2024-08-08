import mongoose from "mongoose";
import { User } from "./users.modals.js";

const subscriberSchema = new mongoose.Schema({
    From: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    To: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
}, { timestamps: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;