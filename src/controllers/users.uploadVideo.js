import { User } from "../models/users.modals.js";
import { uploadOnCloudinary } from "../files.uploader/cloudinary.uploaders.js";
import { Video } from "../models/videos.modals.js";
import { APIError } from "../utils/APIError.js";

const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, playlist } = req.body;
    const { channelUserName, email } = req.user;

    if (![title, description, playlist].every(Boolean) || [title, description, playlist].some(field => field.trim() === '')) {
      throw new APIError(404, 'All fields are required');
    }

    if (!channelUserName || !email) {
      throw new APIError(400, 'User is not verified');
    }

    // Find the user in the database
    const userInDb = await User.findOne({ $and: [{ channelUserName }, { email }] });

    if (!userInDb) {
      throw new APIError(400, 'User not found');
    }

    const videoPath = req.files && req.files.video ? req.files.video[0].path : null;
    const thumbnailPath = req.files && req.files.thumbnail ? req.files.thumbnail[0].path : null;

    let uploadedVideo = { url: '' };
    let uploadedThumbnail = { url: '' };

    if (videoPath) {
      uploadedVideo = await uploadOnCloudinary(videoPath);
      if (!uploadedVideo || !uploadedVideo.url) {
        throw new APIError(400, 'Unable to upload the video');
      }
    }

    if (thumbnailPath) {
      uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);
      if (!uploadedThumbnail || !uploadedThumbnail.url) {
        throw new APIError(400, 'Unable to upload the thumbnail');
      }
    }

    const videoInDb = await Video.create({
      videoTitle: title.toLowerCase(),
      description: description.toLowerCase(),
      playlist: playlist.toLowerCase(),
      channelUserName: channelUserName.toLowerCase(),
      content: uploadedVideo.url.toLowerCase(),
      thumbnail: uploadedThumbnail.url.toLowerCase()
    });

    const createdVideoInDb = await Video.findById(videoInDb._id);
    if (!createdVideoInDb) {
      throw new APIError(502, 'Unable to create video');
    }

    console.log('createdVideoInDb', createdVideoInDb);
    res.status(200).json({ createdVideoInDb, user: userInDb });
  } catch (error) {
    if (error instanceof APIError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
    next(error);
  }
};

export { uploadVideo };
