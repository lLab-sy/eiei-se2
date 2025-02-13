
 
import { MediaTypeDTO } from '../dtos/mediaTypeDTO';
import MediaType from '../models/mediaType';
import mediaRepository from '../repositories/mediaRepository';
 
class MediaTypeService {

  async getAllMediaType(): Promise<MediaTypeDTO[]> {
    try {
        const mediaTypes = await mediaRepository.getAllMediaTypes();
        const result = mediaTypes.map((mediaType) => {
            const dto = new MediaTypeDTO();
            dto.id = mediaType.id.toString();
            dto.mediaName = mediaType.mediaName;
            return dto;
          });
    
          return result;
    } catch (error) {
        console.error('Error in service layer:', error);
        throw new Error('Error in service layer: ' + error);
    }
}


async getMediaType(id:string): Promise<MediaTypeDTO|null> {
  try {
      const mediaType = await mediaRepository.getMediaType(id);

      if (mediaType!=null){
          const result = new MediaTypeDTO();
          result.id=mediaType.id
          result.mediaName= mediaType.mediaName
          return result; 
      }else{
          return null
      }
      
  } catch (error) {
      console.error('Error in service layer:', error);
      throw new Error('Error in service layer: ' + error);
  }
}

  async createMediaType(mediaTypeData: MediaTypeDTO) {
    try {
      const mediaModel = new MediaType({
        mediaName: mediaTypeData.mediaName
      });
      return await mediaRepository.createMediaType(mediaModel);
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async updateMediaType(mediaTypeData: MediaTypeDTO,id: string){
    try {
      // map to model before pass it to repository
      const mediaModel = new MediaType({
        mediaName: mediaTypeData.mediaName
      });
      const res=await mediaRepository.updateMediaType(mediaTypeData,id);
      return res;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async deleteMediaType(mediaTypeData: MediaTypeDTO,id: string){
    try {
      // map to model before pass it to repository
      const mediaModel = new MediaType({
        mediaName: mediaTypeData.mediaName
      });
      const res=await mediaRepository.deleteMediaType(mediaTypeData,id);
      return res;
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }
}

// Export an instance of the service
export default new MediaTypeService();
