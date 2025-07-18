// src/god-complex/index.ts
// Import all lawyers
import { StatisticalEngine } from './engines/statistical/statistical';
import { PatternEngine } from './engines/pattern/pattern';
import { ProbabilityEngine } from './engines/probability/probability';
import { MomentumEngine } from './engines/momentum/momentum';
import { MarketEngine } from './engines/market/market';
import { WatchdogEngine } from './engines/micheal/watchdog';
import { SimilarityEngine } from './engines/similarity/similarity';
import { LearningEngine } from './engines/learning/learning';
import { JudgeEngine } from './engines/george/judge';
import { HumanEngine } from './engines/adam/human';
export class GodComplex {
    // Lawyers
    statistical;
    pattern;
    probability;
    momentum;
    market;
    watchdog;
    similarity;
    learning;
    human;
    // Judge
    judge;
    constructor() {
        // Initialize lawyers
        this.statistical = new StatisticalEngine();
        this.pattern = new PatternEngine();
        this.probability = new ProbabilityEngine();
        this.momentum = new MomentumEngine();
        this.market = new MarketEngine();
        this.watchdog = new WatchdogEngine();
        this.similarity = new SimilarityEngine();
        this.learning = new LearningEngine();
        this.human = new HumanEngine();
        // Initialize judge
        this.judge = new JudgeEngine();
    }
    /**
     * This runs once for every batch (today/live).
     * 1. Calls all lawyers (engines)
     * 2. Sends their verdicts to the Judge
     * 3. Returns final verdicts
     */
    async process(matches, dataType) {
        const results = [];
        for (const match of matches) {
            const verdicts = await Promise.all([
                this.statistical.analyze(match, dataType),
                this.pattern.analyze(match, dataType),
                this.probability.analyze(match, dataType),
                this.momentum.analyze(match, dataType),
                this.market.analyze(match, dataType),
                this.watchdog.analyze(match, dataType),
                this.similarity.analyze(match, dataType),
                this.learning.analyze(match, dataType)
            ]);
            const humanVerdict = await this.human.analyze(match, dataType);
            if (humanVerdict) {
                verdicts.push(humanVerdict);
            }
            else {
                console.log(`⚠️ No human verdict for match ${match.id}`);
            }
            const finalVerdict = await this.judge.deliverVerdict(verdicts);
            results.push(finalVerdict);
        }
        return results;
    }
}
