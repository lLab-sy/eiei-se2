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
    try {
        const { file, postname, postdescription, postmediatype, postProjectRole, poststatus } = req.body;

        // If there's a file, decode it from base64 and save it to disk
        if (file) {
            const buffer = Buffer.from(file, "base64"); // Decode the base64 file
            // const filePath = path.join(__dirname, "..", "uploads", `${Date.now()}.jpg`); // File path
            // fs.writeFileSync(filePath, buffer); // Save the file to disk

            // Optionally, you can store the file path or URL in your database
            // req.body.filePath = filePath; // You can store the file path in the database

            const post = await Post.create({
                postname,
                postdescription,
                buffer,
                postmediatype,
                postProjectRole,
                poststatus,
                // filePath: req.body.filePath || null, // Store file path if present
            });
            res.status(201).json({ success: true, data: post });
        }

        // Create the post with the remaining data
        // const post = await Post.create({
        //     postname,
        //     postdescription,
        //     buffer,
        //     postmediatype,
        //     postProjectRole,
        //     poststatus,
        //     // filePath: req.body.filePath || null, // Store file path if present
        // });

        // res.status(201).json({ success: true, data: post });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(400).json({ success: false, text: "Post creation failed" });
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
