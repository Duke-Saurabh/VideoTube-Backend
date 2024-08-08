import mongoose from 'mongoose';
import Comment from './comments.modals.js';

const videoSchema = new mongoose.Schema({
    videoTitle: {
        type: String,
        required: [true, "Video Title is Required"],
        lowercase: true,
    },
    description: {
        type: String,
        default: "Welcome to my channel on VideoTube! Here, you'll find a diverse range of content, from tutorials and reviews to entertaining vlogs. Hit subscribe and stay tuned for regular updates and exciting videos!",
        lowercase: true,
    },
    playlist: {
        type: String,
        required: [true, "Playlist is Required"],
        lowercase: true, 
    },
    channelUserName: {
        type: String,
        required: true,
        lowercase: true,
    },
    content: {  // link of cloudinary
        type: String,
        required: true
    },
    thumbnail: {  
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });


// Create the User model
const Video = mongoose.model('Video', videoSchema);

// Export the User model and token generation functions
export { Video,videoSchema };

