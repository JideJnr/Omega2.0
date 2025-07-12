// src/god-complex/judge.ts
import { EngineVerdict, PredictionResult } from '../../types/types';

export class JudgeEngine {
  constructor() {}

  public async deliverVerdict(engineVerdicts: EngineVerdict[]): Promise<PredictionResult> {
    if (engineVerdicts.length === 0) throw new Error('No engine verdicts provided.');

    const matchId = engineVerdicts[0].matchId;
    const timestamp = new Date();

    // 1. Count how many engines voted for each outcome
    const counts: Record<'HomeWin' | 'Draw' | 'AwayWin', number> = {
      HomeWin: 0,
      Draw: 0,
      AwayWin: 0
    };

    const totalConfidence: Record<'HomeWin' | 'Draw' | 'AwayWin', number> = {
      HomeWin: 0,
      Draw: 0,
      AwayWin: 0
    };

    for (const v of engineVerdicts) {
      counts[v.predictedOutcome]++;
      totalConfidence[v.predictedOutcome] += v.confidence;
    }

    // 2. Decide the final outcome (most votes)
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const predictedOutcome = sorted[0][0] as 'HomeWin' | 'Draw' | 'AwayWin';

    // 3. Average confidence of agreeing engines
    const confidence = Math.round(
      totalConfidence[predictedOutcome] / (counts[predictedOutcome] || 1)
    );

    // 4. Build final result
    const analysis: Record<string, EngineVerdict> = {};
    for (const v of engineVerdicts) {
      analysis[v.engine] = v;
    }

    return {
      matchId,
      predictedOutcome,
      confidence,
      analysis,
      timestamp
    };
  }
}
