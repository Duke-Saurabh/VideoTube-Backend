import { Video } from "../models/videos.modals.js";

const fetchVideos = async (req, res) => {
    const { channelUserName } = req.query;

    console.log('channelUserName:',channelUserName)
    try {
        let videos;
        if (!channelUserName || channelUserName==='') {
            videos = await Video.aggregate([{ $sort: { createdAt: -1 } }]);
        } else {
            // If channelUserName is provided, add logic to handle that case
            videos = await Video.find({ channelUserName }).sort({ createdAt: -1 });
        }
    
        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Failed to fetch videos', error });
    }
};


export {fetchVideos};