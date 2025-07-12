export interface AnalysisContext {}
export interface PatternResult {}
export interface StatisticalResult {}
export interface ProbabilityResult {}

export interface EngineVerdict {
  engine: string;
  matchId: string;
  dataType: 'today' | 'live' | 'completed';
  predictedOutcome: string;
  confidence: number;
  reasoning?: string;
  timestamp: Date;
}

// src/types/types.ts

export interface PredictionResult {
  matchId: string;

  predictedOutcome: 'HomeWin' | 'Draw' | 'AwayWin';

  confidence: number; // overall confidence from JudgeEngine (0–100)

  analysis: Record<string, EngineVerdict>; 
  // Example: { StatisticalEngine: {...}, MarketEngine: {...} }

  flippedEngines?: string[]; 
  // Optional: which engines were flipped before judging

  finalReasoning?: string; 
  // Judge summary of decision

  commanderSlipStyle?: string; 
  // If used by CommanderBot, which strategy was used

  timestamp: Date;
}
export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  league: string;
  // Add other relevant match data fields
}

export interface MatchAnalysis {
  matchId: string;
  dataType: 'today' | 'live' | 'completed';
  predictions: PredictionResult[];
  timestamp: Date;
}
