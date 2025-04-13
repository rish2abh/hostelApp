import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  v2 as cloudinary, v2 } from 'cloudinary';
import { resolve } from 'path';

@Injectable()
export class CloudinaryService {

  constructor(
  ) {cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME,
    // api_key: process.env.API_KEY,
    // api_secret: process.env.API_SECRET,
      cloud_name: 'dljsm8gxi', 
      api_key: '984486161825914', 
      api_secret: 'jJgwuEl6SLKeG3_XEzsdsc3tsng' 
  })}



  async upload(file: Express.Multer.File): Promise<string> {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
  
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, MP4, and WEBM are allowed.');
    }
  
    return new Promise((resolve, reject) => {
      v2.uploader.upload_stream(
        {
          folder: 'System_gallery',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            return reject(new BadRequestException('File upload failed.'));
          }
  
          if (!result) {
            return reject(new BadRequestException('No result from Cloudinary.'));
          }
  
          console.log('Uploaded photo URL:', result.secure_url);
          resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  }
  
}

  
  