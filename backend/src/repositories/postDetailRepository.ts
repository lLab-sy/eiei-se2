import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import PostDetail, { IPostDetail } from '../models/postDetail';
import { PostDetailDTO } from '../dtos/postDetailDTO';
import { PostDTO } from '../dtos/postDTO';
import Post from '../models/postModel';

class PostDetailRepository {
    public async getAllPostDetails() { //MayBeNotUsed
        try {
             const posts= await PostDetail.find();
             console.log('Posts from database:', posts);
             return posts
        } catch (error) {
            throw new Error('Error fetching posts detail from repository: ' + error);
        }
    }

    public async getPostDetail(id:string) {
        try {
             const objectId = new ObjectId(id);
             const postDetail= await PostDetail.findById(objectId);
             console.log('Posts Detail from database:', postDetail);
             return postDetail
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async createPostDetail(postDetailData: IPostDetail) {
        try {
            const postDetail = new PostDetail(postDetailData);
            return await postDetail.save();
        } catch (error) {
            throw new Error('Error creating post detail in repository: ' + error);
        }
    }

    public async updatePostDetail(postDetailData: PostDetailDTO,id:string) {
        try {
            console.log(postDetailData)
            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedPost = await PostDetail.findOneAndUpdate(
                { _id: objectId},  
                { $set: postDetailData },  
              );
            console.log("response",updatedPost)
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async updatePostDetailSP(postDetailData: PostDTO,id:string) {
        try {
            console.log(postDetailData)
            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedPost = await PostDetail.findOneAndUpdate(
                { _id: objectId},  
                { $set: postDetailData },  
              );
            console.log("response",updatedPost)
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async updateAddCandidate(postDetailData: PostDetailDTO,id:string) {
        try {
            const objectId = new ObjectId(id);
            const updatedPost = await PostDetail.findOneAndUpdate(
                { _id: objectId},  
                { $push: {CandidateDetail:postDetailData} },  
              );
            console.log("response",updatedPost)
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async updatedeleteCandidate(postDetailData: PostDetailDTO,id:string) {
        try {
            const objectId = new ObjectId(id);
            const updatedPost = await PostDetail.findOneAndUpdate(
                { _id: objectId},  
                { $pull: {CandidateDetail:postDetailData} },  
              );
            console.log("response",updatedPost)
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async deletePostDetail(postData: PostDetailDTO,id:string) {
        try {
            const objectId = new ObjectId(id);
            console.log(objectId)
            const postDetail = await PostDetail.findOneAndDelete(
                { _id: objectId}
              );
            console.log("response",postDetail)
            return postDetail;
        } catch (error) {
            throw new Error('Error deleting post detail in repository: ' + error);
        }
    }

    public async findProductionProfessionalByID(user_id: string) {
        try {
            const postDetails = await PostDetail.find(
                { "CandidateDetail.userID": user_id },
                { postId: 1, _id: 0 } // Select only postId
            );
    
            const postIDs = postDetails.map(post => post.postId);
    
            if (postIDs.length === 0) {
                return []; 
            }
    

            const posts = await Post.find({ _id: { $in: postIDs } });
    
            return posts; // Return full post details
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    } 
}

export default new PostDetailRepository();
