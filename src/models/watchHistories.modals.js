import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema({
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
}, { timestamps: true });

// Create a compound index on channelUserName and video
watchHistorySchema.index({ channelUserName: 1, video: 1 }, { unique: true });

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
export default WatchHistory;
