import { MediaTypeDTO } from "../dtos/mediaTypeDTO";
import MediaType, { IMediaType } from "../models/mediaType";
import { ObjectId } from 'mongodb';
 
class MediaTypeRepository {

    //@Public
    public async getAllMediaTypes() {
        try {
             const mediaTypes= await MediaType.find();
             console.log('Media Type from database:', mediaTypes);
             return mediaTypes
        } catch (error) {
            throw new Error('Error fetching mediaType from repository: ' + error);
        }
    }
    //@Private
    public async getMediaType(id:string) {
        try {
             const objectId = new ObjectId(id);
             const mediaType= await MediaType.findById(objectId);
             console.log('Post Roles from database:', mediaType);
             return mediaType
        } catch (error) {
            throw new Error('Error fetching mediaType from repository: ' + error);
        }
    }

    //@Private Admin
    public async createMediaType(mediaTypeData: IMediaType) {
        try {
            const mediaType = new MediaType(mediaTypeData);
            return await mediaType.save();
        } catch (error) {
            throw new Error('Error creating post role in repository: ' + error);
        }
    }

    public async updateMediaType(mediaTypeData: MediaTypeDTO,id:string) {
        try {
            console.log(mediaTypeData)

            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedMediaTypeData = await MediaType.findOneAndUpdate(
                { _id: objectId},   
                { $set: mediaTypeData},  
              );
            console.log("response",updatedMediaTypeData)
 
            return updatedMediaTypeData;
        } catch (error) {
            throw new Error('Error updating updatedMediaTypeData in repository: ' + error);
        }
    }

    public async deleteMediaType(mediaTypeData: MediaTypeDTO,id:string) {
        try {
            console.log(mediaTypeData)
            const objectId = new ObjectId(id);
            // console.log(objectId)
            const mediaType = await MediaType.findOneAndDelete(
                { _id: objectId}
              );
            console.log("response",mediaTypeData)
            return mediaTypeData;
        } catch (error) {
            throw new Error('Error deleting mediaTypeData in repository: ' + error);
        }
    }
}
export default new MediaTypeRepository();
