import { User } from "../models/users.modals.js";
import { Video } from "../models/videos.modals.js";
import WatchHistory from "../models/watchHistories.modals.js";

const fetchAllWatchHistories = async (req, res) => {
    const { channelUserName } = req.user;
    console.log('History Fetch', channelUserName);

    try {
        const histories = await WatchHistory.aggregate([
            {
                $match: {
                    channelUserName: channelUserName
                }
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video'
                }
            },
            {
                $addFields: {
                    video: { $arrayElemAt: ['$video', 0] }
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]
        );

        const userInDb = await User.findOne({ channelUserName });

        console.log('histories',histories)
        res.status(200).json({ userInDb, histories });
    } catch (error) {
        console.error('Error fetching watch histories:', error);
        res.status(500).json({ message: 'Error fetching watch histories' });
    }
};

export { fetchAllWatchHistories };
