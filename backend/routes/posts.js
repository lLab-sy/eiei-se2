const express = require('express')
const multer = require('multer') //http://expressjs.com/en/resources/middleware/multer.html npm install --save multer
const { getPosts,getPostHistoryByID,getPostByID,createPost,updatePost,deletePost } = require('../controller/posts');

const router=express.Router()
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
    
const upload = multer({storage})

 
router.route('/').get(getPosts).post(upload.single('file'), createPost);
router.route('/:id').get(getPostHistoryByID).get(getPostByID).put(updatePost).delete(deletePost)


module.exports=router; //ให้ server.js เรียกใช้