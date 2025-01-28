import mongoose, { Date, Document, Schema } from 'mongoose';

export interface IPost extends Document {
    // nameNa: string;
    postName:String;
    postdescription:String;
    postimage:String;
    postmediatype:String;
    postProjectRole:'actor'| 'cameraman'| 'editor'|'vtuber';
    postStatus:'created'| 'in-progress'| 'success'|'delete';
    startDate: Date;
    endDate: Date;
    // producerID:
    // productionProfessionalID:
    // offer:

}

export const postSchema = new Schema<IPost>({
    // nameNa: { type: String, required: true },
    postName:{type:String,required:[true,'Please add a post name'],
        trim: true,maxlength:[50,'Name can not be more than 50 characters']},
    postdescription:{type:String,
        required:[true,'Please add a description']},
    postimage:{type: String, //mark for now still one image
        required: [true, 'Please add at least one image'],},
    postmediatype:{type:String,
        required:[true,'Please add a postmedia type']}, //array of images
    postProjectRole:{type: String,
        enum:['actor', 'cameraman', 'editor','vtuber'], required:true},
    postStatus: {type: String,
    enum: ['created', 'in-progress', 'success','delete'], //mark
    required: true}
});

const Post = mongoose.model<IPost>('postType', postSchema, 'postTypes');
export default Post;
