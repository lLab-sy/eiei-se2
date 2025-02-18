import crypto from 'crypto'
import s3Client from '../cloud/s3'
import sharp from 'sharp'
import userRepository from '../repositories/userRepository';

class CloudService {
  getKeyName(){
    const imageKey = crypto.randomBytes(32).toString("hex");
    return imageKey
  }
  async uploadImageToCloud(buffer: Buffer, mimetype : string, imageKey : string) : Promise<{
    imageKey: string,
    url: string
  }> {
    try {
      if(!imageKey){ // check null undefined or empty string
        imageKey = this.getKeyName()
      }
      const resizeBuffer = await sharp(buffer)
        .resize({
          height: 1920,
          width: 1080,
          fit: "contain",
        })
        .toBuffer();
      await s3Client.uploadFile(resizeBuffer, imageKey, mimetype);
      const url = await s3Client.createSignedURL(imageKey)
      return {
        imageKey,
        url
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }
  async deleteImageCloud(key: string){
        try {
            await s3Client.deleteFile(key)
            return {
                success: true
            }
        }catch(err){
            throw new Error(err as string)
        }
  }
  async getSignedUrlImageCloud(key:string){
    try{
        const url = await s3Client.createSignedURL(key)
        return url
    }catch(err){
        throw new Error(err as string)
    }
  }
  async uploadImageToGetURLWithDeleteCondition(buffer : Buffer, mimetype:string, imageKey : string, id: string){
    try{
        
        const {imageKey : key} = await this.uploadImageToCloud(buffer, mimetype, imageKey);
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
  async getUrlWithImageNameAndUploadToCloud(buffer : Buffer, mimetype:string, imageKey : string){
    try{
      const {url, imageKey : imageName} = await this.uploadImageToCloud(buffer, mimetype, imageKey)
      return {
        url,
        imageName //get imageName in case of sending invalid imageKey or don't need to check user imageKeys
      }
    }catch(err){
      throw new Error(err as string)
    }
  }
}

export default new CloudService();