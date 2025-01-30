import Post, { IPost } from '../models/postModel';

class PostRepository {
    public async getAllPosts() {
        try {
            return await Post.find();
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
}

export default new PostRepository();
