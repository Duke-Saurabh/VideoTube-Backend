import WatchLater from "../models/watchLaters.modals.js";

const fetchWatchLaters=async(req,res)=>{
    const { channelUserName } = req.user;

    const watchLaters = await WatchLater.aggregate([
        {
          $match: {
            channelUserName:channelUserName 
          }
        },
        {
          $lookup: {
            from: 'videos', 
            localField: 'video', 
            foreignField: '_id',
            as: 'video', 
            pipeline: [
              {
                $lookup: {
                  from: 'users', 
                  localField: 'channelUserName', 
                  foreignField: 'channelUserName', 
                  as: 'user' 
                }
              },
              {
                $addFields: {
                  user: { $arrayElemAt: ['$user', 0] }           }
              },
              {
                $project: {
                  _id: 1,
                  videoTitle: 1, 
                  description: 1,
                  channelUserName: 1,
                  thumbnail: 1,
                  content: 1,
                  creator: '$user.fullName' 
                }
              }
            ]
          }
        },
        {
          $addFields: {
            video: { $arrayElemAt: ['$video', 0] } 
          }
        }
      ]
      
      );
      
      console.log('channelUserName',channelUserName);
      console.log('fetch watchLater',watchLaters?.[0]?.video);
      res.status(200).json({watchLaters});
      
    
    // [
    //     {
    //       $match: {
    //         channelUserName: 'op1'
    //       }
    //     },
    //     {
    //       $lookup: {
    //         from: 'videos',
    //         localField: 'video',
    //         foreignField: '_id',
    //         as: 'videos' 
    //       }
    //     }
    //   ]
    

}

export {fetchWatchLaters};