import { VerdictModel } from '../models/Verdict';
export class HumanLawyerService {
    async saveVerdict(verdict) {
        const newVerdict = new VerdictModel(verdict);
        await newVerdict.save();
    }
    async getVerdictForMatch(matchId) {
        return await VerdictModel.findOne({ matchId }).exec();
    }
    async getAllVerdicts() {
        return await VerdictModel.find({}).exec();
    }
}
