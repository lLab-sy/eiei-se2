import postDetailRepository from '../repositories/postDetailRepository';
import { PostDetailDTO, ProductionProfessionalHistoryDTO } from '../dtos/postDetailDTO';
import postDetail from '../models/postDetail';
import PostDetail from '../models/postDetail';
import { PostDTO } from '../dtos/postDTO';
import { ProductionProfessionalDtO } from '../dtos/productionProfessionalDTO';

class PostDetailService {

  async getAllPostDetails(): Promise<PostDetailDTO[]> {
    try {
        const postDetails = await postDetailRepository.getAllPostDetails();
        
        const result = postDetails.map((postDetails)=>{
            return new PostDetailDTO({
                id: postDetails.id.toString(),
                postId: postDetails.postID.toString(),
                CandidateDetail: postDetails.CandidateDetail.map(candidate => ({
                  RoleID: candidate.RoleID.toString(),
                  CandidateID: candidate.CandidateID.toString()
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
          id: postDetail.id.toString(),
          postId: postDetail.postID.toString(),
          CandidateDetail: postDetail.CandidateDetail.map(candidate => ({
            RoleID: candidate.RoleID.toString(),
            CandidateID: candidate.CandidateID.toString()
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
      const postDetailModel = new PostDetail({
        postId: postDetailData.postId,
        CandidateDetail: []
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
      const res=await postDetailRepository.updatePostDetail(postDetailData,id);
      return postDetailModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updatePostDetailAddCandidate(postDetailData: PostDetailDTO,id: string){
    try {
      console.log(postDetailData)
      const res=await postDetailRepository.updateAddCandidate(postDetailData,id);
      return res;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updatePostDetailDeleteCandidate(postDetailData: PostDetailDTO,id: string){
    try {
      const res=await postDetailRepository.updatedeleteCandidate(postDetailData,id);
      return res;
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
  async getProductionProfessionalPosts(id:string){
   try {
         const posts = await postDetailRepository.findProductionProfessionalByID(id);
         if(posts){
           const result = posts.map((post) => {
            console.log(post.postID)
             return new ProductionProfessionalHistoryDTO({
               postID: post.postID.toString(),
               postDetailID: post.postDetailID.toString(),
               userID: post.userID.toString(),
               roleName: post.roleName,
               postStatus: post.postStatus,
               postDescription: post.postDescription,
               postImages: post.postImage,
               startDate: post.startDate,
               endDate: post.endDate
               });
           })
           console.log(result)
           return result;
         }
           return null 
       }catch (error) {
             console.error('Error in service layer:', error);
             throw new Error('Error in service layer: ' + error);
       }
    }
}


// Export an instance of the service
export default new PostDetailService();
