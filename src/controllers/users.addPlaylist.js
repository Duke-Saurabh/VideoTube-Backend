import { User } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";

const addPlaylist = async (req, res) => {
  const {playlistToAdd} = req.body; 
  const { channelUserName, email } = req.user;

  // Validate input
  if (!playlistToAdd || typeof playlistToAdd !== 'string' || playlistToAdd.trim() === '') {
    console.log('playlistToAdd',playlistToAdd)
    throw new APIError(400, 'Invalid Input');
  }

  if (!channelUserName || !email) {
    throw new APIError(400, 'User is not verified');
  }

  // Find the user in the database
  const userInDb = await User.findOne({ $and: [{ channelUserName }, { email }] });

  if (!userInDb) {
    throw new APIError(400, 'User not found');
  }

  // Add the playlist to the user's playlists
  if(!userInDb.playLists.includes(playlistToAdd))
  userInDb.playLists.push(playlistToAdd.toLowerCase());
  await userInDb.save({ validateBeforeSave: false });

  // Fetch updated user info
  const updatedUserInDb = await User.findOne({ $and: [{ channelUserName }, { email }] });
  console.log('playlistToAdd',playlistToAdd);
  console.log(updatedUserInDb);
  res.status(200).json({ user: updatedUserInDb });

   
//   res.status(200).json(new APIResponse(200, { user: updatedUserInDb }));
};

export { addPlaylist };
