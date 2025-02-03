import { ProducerDto } from "../dtos/producerDTO";
import { ProductionProfessionalDtO } from "../dtos/productionProfessionalDTO";
import { IProducer } from "../models/userModel"
import bcrypt from 'bcrypt';
import { IProductionProfessional } from "../models/userModel"
import ProducerRespository from '../repositories/producerRepository';
import ProductionProfessionalRespository from "../repositories/productionProfessionalRespository";

class UserService {
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
}

export default new UserService();