import postDetailRepository from '../repositories/postDetailRepository';
import { PostDetailDTO } from '../dtos/postDetailDTO';
import postDetail from '../models/postDetail';
import PostDetail from '../models/postDetail';

class PostDetailService {

  async getAllPostDetails(): Promise<PostDetailDTO[]> {
    try {
        const postDetails = await postDetailRepository.getAllPostDetails();
        
        const result = postDetails.map((postDetails)=>{
            return new PostDetailDTO({
                postId: postDetails.postId.toString(),
                CandidateDetail: postDetails.CandidateDetail.map(candidate => ({
                  RoleID: candidate.RoleID.toString(),
                  CandidateID: candidate.CandidateID,
                })),
              }); 
        })
        // console.log(result, "Mapped Posts");
        return result;
    } catch (error) {
        console.error('Error in service layer:', error);
        throw new Error('Error in service layer: ' + error);
    }
}


async getPostDetail(id: string): Promise<PostDetailDTO | null> {
    try {
      const postDetail = await postDetailRepository.getPostDetail(id);
      if (postDetail) {
        return new PostDetailDTO({
          postId: postDetail.postId.toString(),
          CandidateDetail: postDetail.CandidateDetail.map(candidate => ({
            RoleID: candidate.RoleID.toString(),
            CandidateID: candidate.CandidateID,
          })),
        });
      }
      return null;
    } catch (error) {
      console.error('Error fetching post detail in service layer:', error);
      throw new Error('Error fetching post detail: ' + error);
    }
  }

  async createPostDetail(postDetailData: PostDetailDTO) {
    try {
      // map to model before pass it to repository
      const postDetailModel = new PostDetail({
        postId: postDetailData.postId.toString(),
        CandidateDetail: postDetailData.CandidateDetail.map(candidate => ({
          RoleID: candidate.RoleID.toString(),
          CandidateID: candidate.CandidateID,
        })),
      });
      return await postDetailRepository.createPostDetail(postDetailModel);
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updatePostDetail(postDetailData: PostDetailDTO,id: string){
    try {
      // map to model before pass it to repository
      const postDetailModel = new PostDetail({
        postId: postDetailData.postId.toString(),
        CandidateDetail: postDetailData.CandidateDetail.map(candidate => ({
          RoleID: candidate.RoleID.toString(),
          CandidateID: candidate.CandidateID,
        })),
    });
      const res=await postDetailRepository.updatePost(postDetailData,id);
      return postDetailModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async deletePostDetail(postDetailData: PostDetailDTO,id: string){
    try {
      // map to model before pass it to repository
      const postDetailModel = new PostDetail({
        postId: postDetailData.postId.toString(),
        CandidateDetail: postDetailData.CandidateDetail.map(candidate => ({
          RoleID: candidate.RoleID.toString(),
          CandidateID: candidate.CandidateID,
        })),
    });
      const res=await postDetailRepository.deletePostDetail(postDetailData,id);
      return postDetailModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }
}

// Export an instance of the service
export default new PostDetailService();
