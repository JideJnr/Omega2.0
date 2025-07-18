// src/analyst-bots/engines/human.ts
import { HumanLawyerService } from '../../../services/humanLawyer.service';
export class HumanEngine {
    humanLawyerService;
    constructor() {
        this.humanLawyerService = new HumanLawyerService();
    }
    async analyze(match, dataType) {
        // Try to find a human-submitted verdict for this match
        const verdict = await this.humanLawyerService.getVerdictForMatch(match.id);
        if (!verdict) {
            return null; // No human opinion yet
        }
        return {
            engine: 'OfflineBot', // or 'HumanEngine' if you prefer
            matchId: match.id,
            dataType,
            predictedOutcome: 'verdict.predictedOutcome',
            confidence: verdict.confidence || 100,
            reasoning: 'verdict.reasoning',
            timestamp: new Date(),
        };
    }
}
