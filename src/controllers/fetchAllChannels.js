import { User } from "../models/users.modals.js";

const fetchAllChannels=async(req,res)=>{
  

    try {
            const channels= await User.aggregate([
                {
                  $lookup: {
                    from: 'videos',           // The collection to join with
                    localField: 'channelUserName',     // The field in the User collection
                    foreignField: 'channelUserName',  // The field in the Video collection
                    as: 'userVideos'          // The name of the new array field to add to the output
                  }
                },
                {
                  $addFields: {
                    videosLength: { $size: '$userVideos' },
                    description: 'Welcome to my channel on VideoTube! Here, you\'ll find a diverse range of content, from tutorials and reviews to entertaining vlogs. Hit subscribe and stay tuned for regular updates and exciting videos!'
                  }
                },
                {
                  $project: {
                    videosLength: 1,
                    channelUserName: 1,
                    creator: '$fullName',
                    description: 1  // Including the description in the projection
                  }
                }
              ]);











        res.status(200).json({ channels });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Failed to fetch channels', error });
    }
};


export {fetchAllChannels};