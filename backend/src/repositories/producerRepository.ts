import Producer, { IProducer } from "../models/producerModel";
import User from "../models/userModel";
import { ObjectId } from 'mongodb';
class ProducerRepository {
    public async updateProducer(newData: Partial<IProducer>, id: string) {
        try {
            if (!id) {
                throw new Error("Id is required");
            }
            const objectId = new ObjectId(id);
            const updatedProducer = await Producer.findOneAndUpdate(
                { _id: objectId }, 
                { $set: newData }, 
                { new: true, runValidators: true } // Return updated doc, enforce schema validation
            );

            if (!updatedProducer) {
                throw new Error(`Producer not found`);
            }

            return updatedProducer;
        } catch (err) {
            console.error("Error updating producer:", err);
            throw new Error(`Failed to update producer: ${(err as Error).message}`);
        }
    }
}

export default new ProducerRepository();