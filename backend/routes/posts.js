const express = require('express')
const { getPosts,getPostHistoryByID,getPostByID,createPost,updatePost,deletePost } = require('../controller/posts');

const router=express.Router()

 
router.route('/').get(getPosts).post(createPost)
router.route('/:id').get(getPostHistoryByID).get(getPostByID).put(updatePost).delete(deletePost)
module.exports=router; //ให้ server.js เรียกใช้