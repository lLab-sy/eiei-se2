const express = require('express')
const { getPosts,getPost,postPost,putPost,deletePost } = require('../controller/posts');

const router=express.Router()

 
router.route('/').get(getPosts).post(postPost)
router.route('/:id').get(getPost).put(putPost).delete(deletePost)
module.exports=router; //ให้ server.js เรียกใช้