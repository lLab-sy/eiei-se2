import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import Post, { IPost } from '../models/postModel';
import { PostDTO } from '../dtos/postDTO';

class PostRepository {
    public async getAllPosts() {
        try {
             const posts= await Post.find();
             console.log('Posts from database:', posts);
             return posts
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async getPost(id:string) {
        try {
             const objectId = new ObjectId(id);
             const posts= await Post.findById(objectId);
             console.log('Posts from database:', posts);
             return posts
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async createPost(postData: IPost) {
        try {
            const post = new Post(postData);
            return await post.save();
        } catch (error) {
            throw new Error('Error creating post in repository: ' + error);
        }
    }

    public async updatePost(postData: PostDTO,id:string) {
        try {
            console.log(postData)
            // console.log(postData.id,"id")
            // const postId = new Object(postData.id);
            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedPost = await Post.findOneAndUpdate(
                { _id: objectId},  // Query by the provided id
                { $set: postData }, // Set the new post data
              );
            console.log("response",updatedPost)
            // const posts= await Post.findById(objectId);
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async deletePost(postData: PostDTO,id:string) {
        try {
            console.log(postData)
            const objectId = new ObjectId(id);
            console.log(objectId)
            const post = await Post.findOneAndDelete(
                { _id: objectId}
              );
            console.log("response",post)
            return post;
        } catch (error) {
            throw new Error('Error deleting post in repository: ' + error);
        }
    }
}

export default new PostRepository();
