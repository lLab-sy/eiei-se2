import crypto from 'crypto'
import { createSignedURL, deleteFile, uploadFile } from "../cloud/s3";
import sharp from 'sharp'
import userRepository from '../repositories/userRepository';

class CloudService {
  getKeyName(){
    const imageName = crypto.randomBytes(32).toString("hex");
    return imageName
  }
  async uploadImageToCloud(buffer: Buffer, mimetype : string, imageName : string) : Promise<string> {
    try {
      const resizeBuffer = await sharp(buffer)
        .resize({
          height: 1920,
          width: 1080,
          fit: "contain",
        })
        .toBuffer();
      await uploadFile(resizeBuffer, imageName, mimetype);
      return imageName
    } catch (err: any) {
      throw new Error(err);
    }
  }
  async deleteImageCloud(key: string){
        try {
            await deleteFile(key)
            return {
                success: true
            }
        }catch(err){
            throw new Error(err as string)
        }
  }
  async getSignedUrlImageCloud(key:string){
    try{
        const url = await createSignedURL(key)
        return url
    }catch(err){
        throw new Error(err as string)
    }
  }
  async uploadImageToGetURLWithDeleteCondition(buffer : Buffer, mimetype:string, imageKey : string, id: string){
    try{
        const key = await this.uploadImageToCloud(buffer, mimetype, imageKey);
        const url = await this.getSignedUrlImageCloud(key)
        const user = await userRepository.updateImageKey(key, id)
        return {
            user,
            url
        }
    }catch(err){
        await this.deleteImageCloud(imageKey)
        throw new Error(err as string)
    }
  }
}

export default new CloudService();