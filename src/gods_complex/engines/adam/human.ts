// src/analyst-bots/engines/human.ts

import { MatchData, EngineVerdict } from '../../../types/types';
import { HumanLawyerService } from '../../../services/humanLawyer.service';

export class HumanEngine {
  private humanLawyerService: HumanLawyerService;

  constructor() {
    this.humanLawyerService = new HumanLawyerService();
  }

  public async analyze(
    match: MatchData,
    dataType: 'today' | 'live'
  ): Promise<EngineVerdict | null> {
    // Try to find a human-submitted verdict for this match
    const verdict = await this.humanLawyerService.getVerdictForMatch(match.id);

    if (!verdict) {
      return null; // No human opinion yet
    }

    return {
      engine: 'OfflineBot', // or 'HumanEngine' if you prefer
      matchId: match.id,
      dataType,
      predictedOutcome: verdict.predictedOutcome,
      confidence: verdict.confidence || 100,
      reasoning: verdict.reasoning || 'Manually submitted verdict',
      timestamp: verdict.timestamp,
    };
  }
}
