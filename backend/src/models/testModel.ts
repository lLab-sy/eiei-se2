import mongoose, { Document, Schema } from 'mongoose';

export interface ITest extends Document {
    nameNa: string;
}

export const testSchema = new Schema<ITest>({
    nameNa: { type: String, required: true },
});

const Test = mongoose.model<ITest>('bananaType', testSchema, 'bananaTypes');
export default Test;
