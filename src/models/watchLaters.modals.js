import mongoose from "mongoose";
import { User } from "./users.modals.js";

const watchLaterSchema = new mongoose.Schema({
    channelUserName: {
        type: String,
        required: true,
        lowercase: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: [true, "video id is required in watch later"]
    },
});

// Create a compound index on channelUserName and video
watchLaterSchema.index({ channelUserName: 1, video: 1 }, { unique: true });

const WatchLater = mongoose.model('WatchLater', watchLaterSchema);
export default WatchLater;
