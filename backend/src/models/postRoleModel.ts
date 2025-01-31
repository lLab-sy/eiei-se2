import mongoose, { Document, Schema } from 'mongoose';

export interface IPostRole extends Document {
    roleName: string;
}

export const postRoleSchema = new Schema<IPostRole>({
    roleName: { type: String, required: true },
});

const PostRole = mongoose.model<IPostRole>('postRoleType', postRoleSchema, 'postRoleTypes');
export default PostRole;
