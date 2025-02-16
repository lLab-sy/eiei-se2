import { Router } from "express";
import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import s3Client from '../cloud/s3'
import { Request, Response } from "express";
import sharp from 'sharp'
const router = Router()
// For Testing
const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: any, cb: Function) => {
    const filetypes = /png|jpeg|gif/;
    
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimeType = file.mimetype.startsWith('image/');
    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb('Error: Only PNG, JPEG ,JPG files are allowed!');
    }
};

const upload = multer({
    storage: storage,
    fileFilter
})
router.post('/uploads', upload.array('imgArray'), async(req,res) => {
    console.log(req.files)
    res.status(201).json({success: true, arrayImage: req.files})
})

router.post('/upload', upload.single('img') ,async (req, res) => {
    try{
        const image = req?.file
        const resizeBuffer = await sharp(image?.buffer)
        .resize({
            height: 1920,
            width: 1080,
            fit: 'contain'
        })
        .toBuffer()
        const imageName = crypto.randomBytes(32).toString('hex')
        await s3Client.uploadFile(resizeBuffer, imageName, image?.mimetype!)
        res.status(201).json({success: true})
    }catch(err : any){
        throw new Error(err)
    }
})

router.delete('/delete', async (req : Request, res : Response) => {
    try {
        const key = req.query.key;
        await s3Client.deleteFile(key as string)
        res.status(201).json({success: true})
    }catch(err){
        throw new Error(err as string)
    }
})

router.get('/getUrl', async (req : Request, res : Response) => {
    try{
        const key = req.query.key
        const url = await s3Client.createSignedURL(key as string)
        res.status(201).json({
            success: true,
            signedUrl : url,
        })
    }catch(err){
        throw new Error(err as string)
    }
})
export default router;