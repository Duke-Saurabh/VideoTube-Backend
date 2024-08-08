import { User } from "../models/users.modals.js";
import { Video } from "../models/videos.modals.js";
import WatchLater from "../models/watchLaters.modals.js";
import { APIError } from "../utils/APIError.js";
import mongoose from 'mongoose'; // Ensure mongoose is imported to use ObjectId

const { ObjectId } = mongoose.Types;

const addWatchLater = async (req, res, next) => {
    try {
        console.log(req.body);
        const {videoId}=req.body;
        const {channelUserName}=req.user;
        console.log('channelUserName',channelUserName);
        console.log('video id',videoId);

        if(!videoId){
            throw new APIError(404,'Video id not present');
        }

        const watchLaterInDb=await WatchLater.findOne({video:ObjectId(videoId),channelUserName});
        if(watchLaterInDb){
            console.log('This is already in Watch later',watchLaterInDb)
            throw new APIError(400,'Watch Later Already in db');
            return;
        }

        const watchLater=await WatchLater.create({
            video:ObjectId(videoId),
            channelUserName    
        })

        console.log('watchLater:',watchLater)

        const userInDb=await User.find({channelUserName}).select('-password -refreshToken');
        console.log(userInDb);
        res.status(200).json({userInDb});

        
        
    } catch (error) {
        console.log(error);
        throw new APIError(404,`Some error in Watch later ${error}`);
       
    }
};

export { addWatchLater };
