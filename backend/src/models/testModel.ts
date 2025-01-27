import mongoose, { Document, Schema } from 'mongoose';

interface ITest extends Document {
    id: string;
    name: string;
}

const testSchema = new Schema<ITest>({
    name: { type: String, required: true },
});

const Test = mongoose.model<ITest>('Media_type', testSchema);
export default Test;
