import jwt from 'jsonwebtoken';
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/assyncHandlers.js";
import { REFRESH_TOKEN_SECRET, User, generateAccessToken } from '../models/users.modals.js';

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;  // Corrected cookie retrieval
    if (!refreshToken) {
        console.log(refreshToken);
        throw new APIError(400, 'Refresh token not provided');
    }
    try {
        const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const { userName, email } = decodedToken;
        
        const user = await User.findOne({ userName, email });
        
        if (!user || user.refreshToken !== refreshToken) {
            throw new APIError(404, 'User not found or invalid refresh token');
        }

        const newAccessToken = generateAccessToken({ userName, email });

        // Set the new access token in the cookie with proper security settings
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
        }).json({ newAccessToken });
    
    } catch (error) {
        console.error('Error in validation of refresh token. Error:', error);
        throw new APIError(401, 'Invalid or expired refresh token');
    }
});

export { refreshAccessToken };
