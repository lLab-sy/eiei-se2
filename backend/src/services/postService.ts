import postRepository from '../repositories/postRepository';
import { PostDTO} from '../dtos/postDTO';
import Post from '../models/postModel';
import mongoose from 'mongoose';

class PostService {

  async getAllPosts(): Promise<PostDTO[]> {
    try {
        const posts = await postRepository.getAllPosts();
        //console.log("Fetched posts:", posts); // Check the structure of the fetched posts

        const result = posts.map((post) => {
            const startDate = new Date(post.startDate.toString()) 
            const endDate =  new Date(post.endDate.toString()) 

     

            return new PostDTO({
                id: post.id.toString(),
                postName: post.postName as string,
                postDescription: post.postDescription as string,
                postImages: post.postImages as [string],
                postMediaType: post.postMediaType as string,
                postProjectRoles: post.postProjectRoles.map(eachRole=>(
                  eachRole.toString()
                )) as [string],
                // postProjectRoles: post.postProjectRoles as [string],
                postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
                // postDetailID: post.postDetailID.toString() as string,
                userID: post.userID.toString() as string,
                startDate: startDate,
                endDate: endDate,
            });
        });
        // console.log(result, "Mapped Posts");
        return result;
    } catch (error) {
        console.error('Error in service layer:', error);
        throw new Error('Error in service layer: ' + error);
    }
}


async getPost(id:string): Promise<PostDTO|null> {
  try {
      const post = await postRepository.getPost(id);
    
      //console.log("Fetched posts:", posts); // Check the structure of the fetched posts
      if (post!=null){
          const result = new PostDTO({
            id: post.id.toString(),
            postName: post.postName as string,
            postDescription: post.postDescription as string,
            postImages: post.postImages as [string],
            postMediaType: post.postMediaType as string,
            postProjectRoles: post.postProjectRoles.map(eachRole=>(
              eachRole.toString()
            )) as [string],
            postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
            // postDetailID: post.postDetailID.toString() as string,
            userID: post.userID.toString() as string,
            startDate: new Date(post.startDate.toString()) ,
            endDate: new Date(post.endDate.toString()) ,
          });
          return result; 
      }else{
          return null
      }
     
      
      
  } catch (error) {
      console.error('Error in service layer:', error);
      throw new Error('Error in service layer: ' + error);
  }
}

  async createPost(postData: PostDTO) {
    try {
      // map to model before pass it to repository
      console.log(postData.postProjectRoles)
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImages: postData.postImages,
        postMediaType:postData.postMediaType,
        postProjectRoles: postData.postProjectRoles,
        postStatus: postData.postStatus,
        userID: postData.userID,
        startDate: new Date(postData.startDate),
        endDate: new Date (postData.endDate),
      });
      console.log(postModel)
      return await postRepository.createPost(postModel);
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updatePost(postData: PostDTO,id: string){
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImages: postData.postImages,
        postMediaType:postData.postMediaType,
        postProjectRoles: postData.postProjectRoles,
        postStatus: postData.postStatus,
        userID: postData.userID,
        startDate: new Date(postData.startDate),
        endDate: new Date (postData.endDate),
      });
      const res=await postRepository.updatePost(postData,id);
      return postModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async deletePost(postData: PostDTO,id: string){
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImage: postData.postImages,
        postMediaType:postData.postMediaType,
        postProjectRole: postData.postProjectRoles,
        postStatus: postData.postStatus,
        startDate: new Date(postData.startDate),
        endDate: new Date (postData.endDate),
      });
      const res=await postRepository.deletePost(postData,id);
      return postModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }
}

// Export an instance of the service
export default new PostService();
