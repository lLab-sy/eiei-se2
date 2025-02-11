import postRoleRepository from '../repositories/postRoleRepository';
import { PostRoleDTO } from '../dtos/postRoleDTO';
import PostRole from '../models/postRoleModel';

class PostRoleService {

  async getAllPostRoles(): Promise<PostRoleDTO[]> {
    try {
        const postRoles = await postRoleRepository.getAllPostRoles();
        const result = postRoles.map((postRole) => {
            const dto = new PostRoleDTO();
            dto.id = postRole.id.toString();
            dto.roleName = postRole.roleName;
            return dto;
          });
    
          return result;
    } catch (error) {
        console.error('Error in service layer:', error);
        throw new Error('Error in service layer: ' + error);
    }
}


async getPostRole(id:string): Promise<PostRoleDTO|null> {
  try {
      const postRole = await postRoleRepository.getPostRole(id);

      if (postRole!=null){
          const result = new PostRoleDTO();
          result.id=postRole.id
          result.roleName=postRole.roleName
          return result; 
      }else{
          return null
      }
      
  } catch (error) {
      console.error('Error in service layer:', error);
      throw new Error('Error in service layer: ' + error);
  }
}

  async createPostRole(postRoleData: PostRoleDTO) {
    try {
      const postModel = new PostRole({
        roleName: postRoleData.roleName
      });
      return await postRoleRepository.createPostRole(postModel);
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updatePostRole(postRoleData: PostRoleDTO,id: string){
    try {
      // map to model before pass it to repository
      const postModel = new PostRole({
        roleName: postRoleData.roleName
      });
      const res=await postRoleRepository.updatePostRole(postRoleData,id);
      return postModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async deletePostRole(postRoleData: PostRoleDTO,id: string){
    try {
      // map to model before pass it to repository
      const postModel = new PostRole({
        roleName: postRoleData.roleName
      });
      const res=await postRoleRepository.deletePostRole(postRoleData,id);
      return postModel;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }
}

// Export an instance of the service
export default new PostRoleService();
