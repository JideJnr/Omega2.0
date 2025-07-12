// src/analyst-bots/engines/statistical.ts

import { MatchData, EngineVerdict } from '../../../types/types';

export class StatisticalEngine {
  constructor() {
    // any init (load data, set thresholds…)
  }

  public async analyze(
    match: MatchData,
    dataType: 'today' | 'live'
  ): Promise<EngineVerdict> {
    // 1) Pull stats from match
    const { homeGoalsAvg, awayGoalsAvg } = match.teamStats;

    // 2) Simple rule: if homeAvg > awayAvg + 0.3 → home win
    let outcome: 'HomeWin' | 'Draw' | 'AwayWin' = 'Draw';
    if (homeGoalsAvg - awayGoalsAvg > 0.3) outcome = 'HomeWin';
    else if (awayGoalsAvg - homeGoalsAvg > 0.3) outcome = 'AwayWin';

    // 3) confidence = normalized difference
    const diff = Math.abs(homeGoalsAvg - awayGoalsAvg);
    const confidence = Math.min(100, Math.round(diff * 50 + 50)); 

    return {
      engine: 'StatisticalEngine',
      matchId: match.id,
      dataType,
      predictedOutcome: outcome,
      confidence,
      reasoning: `Avg goals diff is ${diff.toFixed(2)}`,
      timestamp: new Date(),
    };
  }
}
