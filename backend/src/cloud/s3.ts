import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import dotenv from 'dotenv'

dotenv.config()

const bucketName = process.env.BUCKET_NAME!
const region = process.env.BUCKET_REGION!
const accessKeyId = process.env.ACCESS_KEY!
const secretAccessKey = process.env.SECRET_ACCESS_KEY!
const sessionToken = process.env.SESSION_TOKEN!

const client = new S3Client({
    region : region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken,
    }
})

export function uploadFile(fileBuffer : Buffer, fileName : string, mimetype : string){
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
    }
    
    const command = new PutObjectCommand(params)
    return client.send(command)
}

export async function createSignedURL(key: string){
    const params={
        Bucket: bucketName,
        Key: key
    }

    const command = new GetObjectCommand(params)
    const expireTime = 3600
    const url = await getSignedUrl(client, command, {
        expiresIn: expireTime
    })
    return url
}

export function deleteFile(key: string){
    const params = {
        Bucket: bucketName,
        Key: key,
    }
    const command = new DeleteObjectCommand(params)
    return client.send(command)
}
