// offline-bot/humanLawyer.service.ts

import { EngineVerdict } from '../types/types';
import { getMongoCollection } from '../db'; 

export class HumanLawyerService {
  private collection = getMongoCollection('offline_verdicts');

  public async saveVerdict(verdict: EngineVerdict) {
    await this.collection.insertOne(verdict);
  }

  public async getVerdictForMatch(matchId: string): Promise<EngineVerdict | null> {
    return await this.collection.findOne({ matchId });
  }

  public async getAllVerdicts(): Promise<EngineVerdict[]> {
    return await this.collection.find({}).toArray();
  }
}

