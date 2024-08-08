import { asyncHandler } from "../utils/assyncHandlers.js";
import { User } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";


const register = asyncHandler(async (req, res) => {
    const { fullName, channelUserName, email, password } = req.body;

    console.log(req.body);
    console.log('Name:', fullName);
    console.log('channelUserName:', channelUserName);
    console.log('Email:', email);

    // All fields are required
    if (![fullName, channelUserName, email, password].every(Boolean) || [fullName, channelUserName, email, password].some(field => field.trim() === '')) {
        throw new APIError(404, 'All fields are required');
    }

    console.log('rea',req.body);

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [
            { channelUserName },
            { email }
        ]
    });

    if (existedUser) {
        console.log(existedUser);
        throw new APIError(409, 'User already exists. Register with a new userName or Email');
    }

    
    const fullNameParts = fullName.split(' '); // Split the full name into parts
    const capitalizedFullName = fullNameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
   
    const user = await User.create({
        fullName: capitalizedFullName.trim(),
        channelUserName: channelUserName.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
      
        
    });
    

    // Created user
    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
        throw new APIError(502, 'Unable to create user');
    }

    console.log('rea',req.body);
    res.status(200).json(new APIResponse(200, createdUser));
});

export { register };
