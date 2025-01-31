import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
// import Post, { IPost } from '../models/postModel';
import PostRole, { IPostRole } from '../models/postRoleModel';
import { PostRoleDTO } from '../dtos/postRoleDTO';

class PostRoleRepository {
    public async getAllPostRoles() {
        try {
             const roles= await PostRole.find();
             console.log('Posts Role from database:', roles);
             return roles
        } catch (error) {
            throw new Error('Error fetching roles from repository: ' + error);
        }
    }

    public async getPostRole(id:string) {
        try {
             const objectId = new ObjectId(id);
             const role= await PostRole.findById(objectId);
             console.log('Post Roles from database:', role);
             return role
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async createPostRole(postRoleData: IPostRole) {
        try {
            const postRole = new PostRole(postRoleData);
            return await postRole.save();
        } catch (error) {
            throw new Error('Error creating post role in repository: ' + error);
        }
    }

    public async updatePostRole(postRoleData: PostRoleDTO,id:string) {
        try {
            console.log(postRoleData)

            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedPostRole = await PostRole.findOneAndUpdate(
                { _id: objectId},  // Query by the provided id
                { $set: postRoleData }, // Set the new post data
              );
            console.log("response",updatedPostRole)
 
            return updatedPostRole;
        } catch (error) {
            throw new Error('Error updating post role in repository: ' + error);
        }
    }

    public async deletePostRole(postRoleData: PostRoleDTO,id:string) {
        try {
            console.log(postRoleData)
            const objectId = new ObjectId(id);
            console.log(objectId)
            const post = await PostRole.findOneAndDelete(
                { _id: objectId}
              );
            console.log("response",post)
            return post;
        } catch (error) {
            throw new Error('Error deleting post in repository: ' + error);
        }
    }
}

export default new PostRoleRepository();
