import postRepository from '../repositories/postRepository';
import { PostDTO} from '../dtos/postDTO';
import Post from '../models/postModel';

class PostService {

  async getAllPosts(): Promise<PostDTO[]> {
    try {
        const posts = await postRepository.getAllPosts();
        //console.log("Fetched posts:", posts); // Check the structure of the fetched posts

        const result = posts.map((post) => {
            const startDate = post.startDate ? new Date(post.startDate.toString()) : new Date();
            const endDate = post.endDate ? new Date(post.endDate.toString()) : new Date();

            // console.log("Start Date:", startDate);
            // console.log("End Date:", endDate);

            return new PostDTO({
                id: post.id.toString(),
                postName: post.postName as string,
                postDescription: post.postDescription as string,
                postImage: post.postImage as string,
                postMediaType: post.postMediaType as string,
                postProjectRole: post.postProjectRole as 'actor' | 'cameraman' | 'editor' | 'vtuber',
                postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'delete',
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
              postImage: post.postImage as string,
              postMediaType: post.postMediaType as string,
              postProjectRole: post.postProjectRole as 'actor' | 'cameraman' | 'editor' | 'vtuber',
              postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'delete',
              startDate: post.startDate ? new Date(post.startDate.toString()) : new Date(),
              endDate: post.endDate ? new Date(post.endDate.toString()) : new Date(),
          });
          return result; 
      }else{
          return null
      }
      // console.log(result, "Mapped Posts");
      
      
  } catch (error) {
      console.error('Error in service layer:', error);
      throw new Error('Error in service layer: ' + error);
  }
}

  async createPost(postData: PostDTO) {
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImage: postData.postImage,
        postMediaType:postData.postMediaType,
        postProjectRole: postData.postProjectRole,
        postStatus: postData.postStatus,
        startDate: new Date(postData.startDate),
        endDate: new Date (postData.endDate),
      });
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
        postImage: postData.postImage,
        postMediaType:postData.postMediaType,
        postProjectRole: postData.postProjectRole,
        postStatus: postData.postStatus,
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
        postImage: postData.postImage,
        postMediaType:postData.postMediaType,
        postProjectRole: postData.postProjectRole,
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
