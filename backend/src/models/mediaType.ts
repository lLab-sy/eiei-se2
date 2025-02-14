import mongoose, { Document, Schema } from 'mongoose';

export interface IMediaType extends Document {
    mediaName: string;
}

export const mediaTypeSchema = new Schema<IMediaType>({
    mediaName: { type: String, required: true },
});

const MediaType = mongoose.model<IMediaType>('mediaType', mediaTypeSchema, 'mediaTypes');
export default MediaType;
