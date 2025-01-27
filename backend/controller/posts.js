//Put Model file
const Post= require('../models/Post');
 
    
 
//@desc Get all Posts
//@route GET /api/v1/Posts
//@access Public
exports .getPosts=async (req,res,next)=>{
    try{
        const posts= await Post.find();
        if(!posts){ //กรณีหาไม่เจอ
            return  res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:posts})
    }
    catch{
        res.status(400).json({success:false})
    }
}
//@desc Get Post
//@route GET /api/v1/Posts
///:id
//@access Public
exports .getPostByID=async (req,res,next)=>{
    try{
        const post = await Post.create(req.body)
        res.status(201).json({success:true,data:post})
    }catch{
        res.status(400).json({success:false,text:"created failed"})
    }
}
//@desc Get Post For History findManyBy(userID,postStatus)
//@route GET /api/v1/Posts
///:id
//@access Public
exports .getPostHistoryByID=async (req,res,next)=>{ //Can't use for now
    try{
        const userId= req.params.id// Match the user ID
        const posts = await Post.find({
            userId, 
            postStatus: 'success',  
          });
        if(!posts){ //กรณีหาไม่เจอ
            return  res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:posts})
    }
    catch{
        res.status(400).json({success:false})
    }
}
//@desc Post hospital
//@route POST /api/v1/Posts
//@access Private
// exports .createPost= async (req,res,next)=>{
//     try{
//         const post = await Post.create(req.body)
//         res.status(201).json({success:true,data:post})
//     }catch{
//         res.status(400).json({success:false,text:"created failed"})
//     }
// }
exports.createPost = async (req, res, next) => {
    try{
        const post = await Post.create({
            postname: req.body.postname,
            postdescription: req.body.postdescription,
            postimage: req.file.filename,
            postmediatype: req.body.postmediatype,
            postProjectRole: req.body.postProjectRole,
            poststatus: req.body.poststatus

        })
        res.status(201).json({success:true,data:post})
    }catch(err){
        res.status(400).json({success:false,text:err})
    }
};
//@desc Update hospital
//@route PUT /api/v1/Posts
//@access Private
exports .updatePost= async (req,res,next)=>{
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!post){
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true, data:post})
    }catch{
        res.status(400).json({success:false})
    }
}
//@desc Delete hospital
//@route DELETE /api/v1/Posts
///:id
//@access Private
exports .deletePost=async (req,res,next)=>{
    try{
        const post = await Post.findByIdAndDelete(req.params.id) //Delete Hospital
        // console.log(hospital) //Print โรงพยาบาลที่ลบ
        if(!post){ //กรณีไม่เจอก็ Handler  400 
            console.log("Not found")
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:{}})
    }catch{
        res.status(400).json({success:false})
    }
}
