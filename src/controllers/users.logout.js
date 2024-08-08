import { User } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/assyncHandlers.js";
import { APIResponse } from "../utils/APIResponse.js";

// Logout
const logout = asyncHandler(async (req, res) => {
    const { channelUserName, email } = req.body;
    console.log(req.body);
    const user = await User.findOne({ channelUserName, email });

    if (!user) {
        throw new APIError(404, 'User not found');
    }

    // Clear the refreshToken cookie
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Clear the refreshToken in the user document
    user.refreshToken = '';

    // Save the user with refreshToken cleared
    await user.save({ validateBeforeSave: false });

    console.log(user);

    

    // Send a response indicating successful logout
    res.json({accessToken:null,refreshToken:null,message:'Logout successful'});
});

export { logout };
