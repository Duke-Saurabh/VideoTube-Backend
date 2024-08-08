import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/assyncHandlers.js";

const authmiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json(new APIError(401, 'Access denied. No token provided.'));
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Wrong Authentication. Error:', error.message);

        throw new APIError(400, 'Invalid Token');
    }
});

export { authmiddleware };
