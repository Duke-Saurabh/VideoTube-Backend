import { User } from "../models/users.modals.js";
import { Video } from "../models/videos.modals.js";
import WatchHistory from "../models/watchHistories.modals.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const startVideo = async (req, res) => {
    const { videoId } = req.body;
    const { channelUserName } = req.user;

    if (!videoId) {
        return res.status(400).json({ message: "Video ID is required" });
    }

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Increment video views
        video.views += 1;
        await video.save({ validateBeforeSave: false });

        // Find and replace watch history, or create it if it doesn't exist
        const watchHistory = await WatchHistory.findOneAndUpdate(
            { channelUserName, video: ObjectId(videoId) },
            { channelUserName, video: ObjectId(videoId) },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Retrieve user details excluding password and refreshToken
        const userInDb = await User.findOne({ channelUserName }).select('-password -refreshToken');
        if (!userInDb) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ userInDb, watchHistory });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export { startVideo };
