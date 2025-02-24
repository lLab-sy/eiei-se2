import { ObjectId } from "mongodb";
import { IProductionProfessional, ProductionProfessional, Rating, searchProductionProfessionalResponse, searchReqModel } from "../models/userModel";
import { PipelineStage } from "mongoose";


class ProductionProfessionalRespository {
    public async updateProductionProfessional(newData : Partial<IProductionProfessional>, id:string) {
        try {
            if (!id) {
                throw new Error("Id is required");
            }
            const objectId = new ObjectId(id);
            const updatedUser = await ProductionProfessional.findOneAndUpdate({
                _id: objectId,
            },{
                $set: newData
            },{runValidators:true, new:true})

            if(!updatedUser){
                throw new Error('Failed to Update this user')
            }
            return updatedUser
        }
        catch(err){
            throw new Error('Cannot Update this user: ' + err)
        }
    }

    async searchProductionProfessional(searchReqModel: searchReqModel): Promise<searchProductionProfessionalResponse> {
        try {
            const matchStage: PipelineStage[] = [];
            
            console.log(searchReqModel)
            
            if (searchReqModel.searchText) {
                // full-text search only available in atlas sad T^T
                // matchStage.push(
                //     { 
                //         $match: { 
                //             $text: { $search: searchReqModel.searchText } 
                //         } 
                //     },
                //     {
                //         $addFields: { score: { $meta: "textScore" } }
                //     }
                // );

                // regex search
                matchStage.push({
                    $match: {
                        $or: [
                            { firstName: { $regex: searchReqModel.searchText, $options: "i" } },
                            { middleName: { $regex: searchReqModel.searchText, $options: "i" } },
                            { lastName: { $regex: searchReqModel.searchText, $options: "i" } },
                            { skill: { $regex: searchReqModel.searchText, $options: "i" } },
                        ]
                    }
                });
            }

            
    
            if (searchReqModel.minExperience !== undefined || searchReqModel.maxExperience !== undefined) {
                const experienceFilter: Record<string, number> = {};
                if (searchReqModel.minExperience !== undefined) {
                    experienceFilter.$gte = searchReqModel.minExperience;
                }
                if (searchReqModel.maxExperience !== undefined) {
                    experienceFilter.$lte = searchReqModel.maxExperience;
                }
                matchStage.push({ $match: { experience: experienceFilter } });
            }
    
            if (searchReqModel.minRating !== undefined) {
                matchStage.push(
                    { $unwind: "$rating" },
                    { 
                        $group: {
                            _id: "$_id",
                            avgRating: { $avg: "$rating.ratingScore" },
                            doc: { $first: "$$ROOT" }
                        }
                    },
                    { $replaceRoot: { newRoot: { $mergeObjects: ["$doc", { avgRating: "$avgRating" }] } } },
                    { $match: { avgRating: { $gte: searchReqModel.minRating } } }
                );
            }
    
            const page = searchReqModel.page || 1;
            const limit = searchReqModel.limit || 10;
            const skip = (page - 1) * limit;
    
            const totalItemstStage: PipelineStage[] = [...matchStage, { $count: "totalCount" }];
            const totalItemsResult = await ProductionProfessional.aggregate(totalItemstStage);
            const totalItems = totalItemsResult.length > 0 ? totalItemsResult[0].totalCount : 0;
    
            matchStage.push({ $sort: { score: -1 } }, { $skip: skip }, { $limit: limit });
    
            const results: IProductionProfessional[] = await ProductionProfessional.aggregate(matchStage);

            const response: searchProductionProfessionalResponse = {
                data: results,
                totalItems: totalItems
            }
            return response
        } catch (err) {
            throw new Error('Error searching production professional: ' + err);
        }
    }
    
    public async addProductionProfessionalReview(id: string, newRatingModel: Rating) {
        try {
            if (!id) {
                throw new Error("Id is required");
            }

            const pipelineStage: PipelineStage[] = [];

            pipelineStage.push({$match: {_id: new ObjectId(id)}})

            const result = await ProductionProfessional.findOneAndUpdate(
                {
                  _id: id,
                  "rating.postID": { $ne: newRatingModel.postID }, // Ensure no duplicate comment from the same user
                },
                { $push: { rating: newRatingModel } },
                { new: true }
            );
          
            if (!result) {
                throw new Error('Review from post already exists or Production professional not found');
            }

            return result
        }
        catch(err){
            throw new Error('Cannot Update this user: ' + err)
        }
    }

}

export default new ProductionProfessionalRespository()