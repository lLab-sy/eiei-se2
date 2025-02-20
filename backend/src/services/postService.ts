import postRepository from '../repositories/postRepository';
import { ImageDisplayDTO, PostDTO, PostSearchRequestDTO, PostWithRoleCountDTO } from '../dtos/postDTO';
import Post, { PostSearchRequestModel } from '../models/postModel';
import { PaginatedResponseDTO, PaginationMetaDTO } from '../dtos/utilsDTO';
import cloudService from './cloudService';

class PostService {
  
  async getAllPosts(queryStr:string): Promise<PostDTO[]> {
    
    try {
        const posts = await postRepository.getAllPosts(queryStr);
  
        const result = await Promise.all(posts.map(async (post) => {
        const postImages:string[] = await Promise.all(
        post.postImages.map(async (eachImg) => {
                return await cloudService.getSignedUrlImageCloud(eachImg);
            })
          );

        var postImageDisplay:ImageDisplayDTO[]=[];
        for (let i = 0; i < postImages.length; i++) {
          postImageDisplay.push({imageURL:postImages[i],imageKey:(post.postImages)[i]})
        }

        return new PostDTO({
                id: post.id.toString(),
                postName: post.postName as string,
                postDescription: post.postDescription as string,
                postImages: postImages as string[],
                postMediaType: post.postMediaType.toString() as string,
                postImagesKey: post.postImages,
                postProjectRolesOut: post.postProjectRoles.map(eachRole=>({    
                  id: (eachRole as any)._id.toString(),
                  roleName: (eachRole as any).roleName
                })),
                postImageDisplay:postImageDisplay as ImageDisplayDTO[],
                postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
                userID: post.userID.toString() as string,
                startDate: post.startDate? post.startDate.toString():"",
                endDate: post.endDate?post.endDate.toString():""
            });
        }));
 
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
        const postImages = await Promise.all(
          post.postImages.map(async (eachImg) => {
              return await cloudService.getSignedUrlImageCloud(eachImg);
          }));

          var postImageDisplay:ImageDisplayDTO[]=[];
          for (let i = 0; i < postImages.length; i++) {
            postImageDisplay.push({imageURL:postImages[i],imageKey:(post.postImages)[i]})
          }

          const result = new PostDTO({
            id: post.id.toString(),
            postName: post.postName as string,
            postDescription: post.postDescription as string,
            postImages: postImages as [string],
            postMediaType: post.postMediaType.toString() as string,
            postProjectRolesOut: post.postProjectRoles.map(eachRole=>({    
              id: (eachRole as any)._id.toString(),
              roleName: (eachRole as any).roleName
            })),
            postImageDisplay:postImageDisplay as ImageDisplayDTO[],
            postImagesKey: post.postImages,
            postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
            // postDetailID: post.postDetailID.toString() as string,
            userID: post.userID.toString() as string,
            startDate: post.startDate? post.startDate.toString():"",
            endDate: post.endDate?post.endDate.toString():""
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

  async getPostsbyUser(id:string): Promise<PostWithRoleCountDTO[]|null> {
    try {
      const posts = await postRepository.getPostsByUser(id);
      if(posts){
        const result = posts.map((post) => {
          const postId = post._id?post._id.toString():'';
          // console.log(post.postMediaType)
          return new PostWithRoleCountDTO({
              id: postId,
              postName: post.postName as string,
              postDescription: post.postDescription as string,
              postImages: post.postImages as [string],
              postMediaType: post.postMediaType as string,
              roleCount: post.roleCount as number,
              postImagesKey: post.postImages,
              postProjectRoles: post.postProjectRoles as string[],
              postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
              startDate: post.startDate? post.startDate.toString():"",
              endDate: post.endDate?post.endDate.toString():""
            });
        })
        // console.log(result)
        return result;
      }
        return null 
    }catch (error) {
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
        postImages: postData.postImages,
        postMediaType:postData.postMediaType,
        postProjectRoles: postData.postProjectRoles,
        postStatus: postData.postStatus,
        userID: postData.userID,
        startDate: postData.startDate?postData.startDate:"",
        endDate: postData.endDate?postData.endDate:""
      });
      console.log("postData",postData)
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
        startDate: postData.startDate?postData.startDate:"",
        endDate: postData.endDate?postData.endDate:""
      });
      await postRepository.updatePost(postData,id);
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
        startDate: postData.startDate?postData.startDate:"",
        endDate: postData.endDate?postData.endDate:""
      });
      await postRepository.deletePost(postData,id);
      return postModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async searchPost(postSearchReq: PostSearchRequestDTO): Promise<PaginatedResponseDTO<PostDTO>> {
    try {
      const postM: PostSearchRequestModel = postSearchReq

      const res = await postRepository.searchPost(postM);
      const resDTO = res.data.map((post) => {
 

        return new PostDTO({
        id: post.id?.toString(),
        postName: post.postName as string,
        postDescription: post.postDescription as string,
        postImages: post.postImages as [string],
        postMediaType: post.postMediaType.toString() as string,
        postProjectRoles: post.postProjectRoles.map(eachRole=>(
          eachRole.toString()
        )) as [string],
        postStatus: post.postStatus as 'created' | 'in-progress' | 'success' | 'cancel',
        // postDetailID: post.postDetailID.toString() as string,
        startDate: post.startDate?post.startDate:"",  
        endDate: post.endDate?post.endDate:""
      })})

      const response: PaginatedResponseDTO<PostDTO> = {
        data: resDTO,
        meta: {
            page: postSearchReq.page,
            limit: postSearchReq.limit,
            totalItems: res.totalItems,
            totalPages: Math.ceil(res.totalItems / postSearchReq.limit)
        } as PaginationMetaDTO
      }
      return response;

    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

}

// Export an instance of the service
export default new PostService();
