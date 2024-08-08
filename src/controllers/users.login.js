import { User, generateAccessToken, generateRefreshToken } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/assyncHandlers.js";

const sendTokens = async (user, res) => {
    const channelUserName = user.channelUserName;
    const email = user.email;
    // if( user.refreshToken!==''){
    //     console.log(user.refreshToken);
    //     throw new APIError(409,'you already logined at other device');

    // }
        
    console.log('email:',email)
    const accessToken = generateAccessToken({ channelUserName, email });
    const refreshToken = generateRefreshToken({ channelUserName, email });
    user.refreshToken = refreshToken;
    console.log('user:',user)

    try {
        // Save the user without executing the pre-save middleware
        console.log('user save:',user)
        await user.save({ validateBeforeSave: false });
        
        console.log('user saved:',user)
        // Perform field selection
         const resUser= await User.findById(user._id).select('-password -securityKey -refreshToken');
         console.log(resUser);

         // Send the access token, refresh token, and selected user fields to the client
         res.cookie('accessToken', accessToken, { httpOnly: true, secure: true })
         .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
         .json({ accessToken, refreshToken, user:resUser });
     

    } catch (error) {
        // Handle error
        console.error('Error saving user:', error);
        // Send error response if not already sent
        if (!res.headersSent) {
            res.status(400).json({ error: error.message });
        }
    }
};

const login = asyncHandler(async (req, res) => {
    if(req.cookies?.accessToken){
        throw new APIError(409,'you are already logined. Use Other device');
    }
    
    const { channelUserName, email, password } = req.body;
    console.log(req.body);
    console.log(channelUserName, email, password);
    

    if (!channelUserName || !email || !password || [channelUserName, email, password].some(field => field.trim() === '')) {
        throw new APIError(402, 'All fields are required in login page');
    }

    const userindb = await User.findOne({ $and: [{ channelUserName }, { email }] });
    if (!userindb) {
        throw new APIError(404, 'This user does not exist in the database. Please sign up first.');
    }
    console.log(channelUserName, email, password);
    const isMatch = await userindb.comparePassword(password);
    if (!isMatch) {
        throw new APIError(404, 'Wrong password. Try again or use forgot password.');
    }

    console.log(channelUserName, email, password);
    // Pass the user and res to sendTokens
    await sendTokens(userindb, res);
});

export { login };
