import { ObjectId } from "mongodb";
import ProductionProfessional, { IProductionProfessional } from "../models/productionProfessionalModel";
import User from "../models/userModel";

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
            throw new Error('Cannot Update this user')
        }
    }
}

export default new ProductionProfessionalRespository()