import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({/*not able to understand why I am not able to use .env file here.*/
  cloud_name:'dxxipbhrc',
  api_key:823156128736933,
  api_secret:'WAyhHWBnYBf7PCfd_RFhMU3r6vI',
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log(localFilePath); // Log the local file path for debugging
  try {
    if (!localFilePath) return null;
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    console.log(process.env.CLOUDINARY_API_KEY)
    // File has been uploaded successfully
    console.log("File is uploaded on Cloudinary");
    console.log(response.url);
    // Clean up the temporary files
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };

