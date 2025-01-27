import mongoose, { Document, Schema } from 'mongoose';

interface ITest extends Document {
    name: string;
}

const testSchema = new Schema<ITest>({
    name: { type: String, required: true },
});

const Test = mongoose.model<ITest>('media_type', testSchema);
export default Test;
