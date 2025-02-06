import { ProducerDto } from "../dtos/producerDTO";
import { ProductionProfessionalDtO } from "../dtos/productionProfessionalDTO";
import { IProducer, searchReqModel } from "../models/userModel"
import bcrypt from 'bcrypt';
import { IProductionProfessional } from "../models/userModel"
import ProducerRespository from '../repositories/producerRepository';
import ProductionProfessionalRespository from "../repositories/productionProfessionalRespository";
import { searchReqDTO } from "../dtos/userDTO";
import { PaginatedResponseDTO, PaginationMetaDTO } from "../dtos/utilsDTO";

class UserService {
    async getUser(username:string){
        try{
            const getUser = await userRepository.findUserByUsername(username)
            
            return getUser
        }catch(err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }
    async updateProducer(producerDTO: ProducerDto, id: string) {
        try {
            const hashedPassword = await bcrypt.hash(producerDTO.password, 10)
            const producerObject = { ...producerDTO, password: hashedPassword};

            const res = await ProducerRespository.updateProducer(producerObject as IProducer, id);
            return res;
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error in service layer: " + (error as Error).message);
        }
    }

    async updateProductionProfessional(productionDTO: ProductionProfessionalDtO, id: string) {
        try {
            const hashedPassword = await bcrypt.hash(productionDTO.password, 10)
            const professionalObject = { ...productionDTO, password:hashedPassword };
            const res = await ProductionProfessionalRespository.updateProductionProfessional(professionalObject as IProductionProfessional, id);
            return res;
        } catch (error) {
            console.error("Error updating Production Professional:", error);
            throw new Error("Error in service layer: " + (error as Error).message);
        }
    }

    async searchProductionProfessional(searchReq: searchReqDTO): Promise<PaginatedResponseDTO<ProductionProfessionalDtO>> {
        try {
            const searchModel: searchReqModel = searchReq
            const results = await ProductionProfessionalRespository.searchProductionProfessional(searchModel)
            const response: PaginatedResponseDTO<ProductionProfessionalDtO> = {
                data: results.data,
                meta: {
                    page: searchModel.page,
                    limit: searchModel.limit,
                    totalItems: results.totalItems,
                    totalPages: Math.ceil(results.totalItems / searchModel.limit)
                } as PaginationMetaDTO
            }
            return response;
        } catch (error) {
            throw new Error("Error in service layer when search Production Professional: " + (error as Error).message);
        }
    }
}

export default new UserService();