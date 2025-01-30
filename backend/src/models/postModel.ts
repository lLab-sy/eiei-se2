import mongoose, { Date, Document, Schema } from 'mongoose';

export interface IPost extends Document {
    // nameNa: string;
    postName:String;
    postDescription:String;
    postImage:String;
    postMediaType:String;
    postProjectRole:'actor'| 'cameraman'| 'editor'|'vtuber';
    postStatus:'created'| 'in-progress'| 'success'|'delete';
    startDate: String;
    endDate: String;
    // producerID:
    // productionProfessionalID:
    // offer:

}

export const postSchema = new Schema<IPost>({
    // nameNa: { type: String, required: true },
    postName:{type:String,required:[true,'Please add a post name'],
        trim: true, maxlength:[50,'Name can not be more than 50 characters']},
    postDescription:{type:String,
        required:[true,'Please add a description'], maxlength:[500,'Name can not be more than 500 characters']},
    postImage:{type: String, //mark for now still one image
        required: [true, 'Please add at least one image'],},
    postMediaType:{type:String,
        required:[true,'Please add a postmedia type']}, //array of images
    postProjectRole:{type: String,
        enum:['actor', 'cameraman', 'editor','vtuber'], required:true},
    postStatus: {type: String,
    enum: ['created', 'in-progress', 'success','delete'], //mark
    required: true},
    startDate:{type:Date},
    endDate:{type:Date}
});

const Post = mongoose.model<IPost>('postType', postSchema, 'postTypes');
export default Post;
