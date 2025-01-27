import mongoose from "mongoose";
import { Schema } from "mongoose";

 

 //Didn't use for now
const PostSchema = new mongoose.Schema({
    postname:{
        type: String,
        required:[true,'Please add a name'],
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    postdescription:{
        type:String,
        required:[true,'Please add a description']
    },
    postimage:{ 
        type: [Buffer], // Updated for array of images (buffers)
        required: [true, 'Please add at least one image'],
    },
    postmediatype:{
        type:String,
        required:[true,'Please add a postmedia type'] //array of images
    },
    postProjectRole:{
        type: String,
        enum: ['actor', 'cameraman', 'editor','vtuber'], //mark
        required: true,
    },
    poststatus:{
        type: String,
        enum: ['created', 'in-progress', 'success','delete'], //mark
        required: true,
    } 
});


// module.exports = mongoose.model('Car', CarSchema);  
 const Post= mongoose.models.Post || mongoose.model("Post",PostSchema);
 export default Post
