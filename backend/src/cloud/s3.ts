import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import dotenv from 'dotenv'

dotenv.config()

class S3ClientClass {
    private client: S3Client;
    private bucketName: string;
  
    constructor() {
      this.bucketName = process.env.BUCKET_NAME!;
      const region = process.env.BUCKET_REGION!;
      const accessKeyId = process.env.ACCESS_KEY!;
      const secretAccessKey = process.env.SECRET_ACCESS_KEY!;
      const sessionToken = process.env.SESSION_TOKEN!;
  
      this.client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
        }
      });
    }
  

    public async uploadFile(fileBuffer: Buffer, fileName: string, mimetype: string) {
      console.log("cloud check")
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
      };
  
      const command = new PutObjectCommand(params);
      return this.client.send(command);
    }
  

    public async createSignedURL(key: string): Promise<string> {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };
      const command = new GetObjectCommand(params);
      const expireTime = 3600;
      const url = await getSignedUrl(this.client, command, {
        expiresIn: expireTime
      });
      return url;
    }
  

    public async deleteFile(key: string) {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };
  
      const command = new DeleteObjectCommand(params);
      return this.client.send(command);
    }
  }
  
  export default new S3ClientClass();