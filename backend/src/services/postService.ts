import postRepository from '../repositories/postRepository';
import { PostDTO} from '../dtos/postDTO';
import Post from '../models/postModel';

class PostService {

  async getAllPosts(): Promise<PostDTO[]> {
    try {
        const posts = await postRepository.getAllPosts();

        return posts.map((post) => new PostDTO({
            id: post.id.toString(),
            postName: post.postName as string,
            postDescription: post.postDescription as string,
            postImage: post.postImage as string,
            postMediaType: post.postMediaType as string,
            postProjectRole: post.postProjectRole as 'actor' | 'cameraman' | 'editor' | 'vtuber',
            postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'delete',
            startDate: new Date(post.startDate.toString()), // Convert to Date
            endDate: new Date(post.endDate.toString()) // Convert to Date
        }));
    } catch (error) {
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
}

// Export an instance of the service
export default new PostService();
