import mongoose, { Schema } from 'mongoose';
const VerdictSchema = new Schema({
    matchId: { type: String, required: true },
    result: { type: String, required: true },
    prediction: { type: String, required: true },
    confidence: { type: Number, required: true },
}, { timestamps: true });
export const VerdictModel = mongoose.model('OfflineVerdict', VerdictSchema);
