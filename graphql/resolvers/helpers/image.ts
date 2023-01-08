import cloudinary, { UploadApiOptions } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});

export const uploadImage = async (
  buffer: Buffer,
  options: UploadApiOptions
): Promise<cloudinary.UploadApiResponse | undefined> =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });
