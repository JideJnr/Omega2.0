import { TriggerManager } from './triggers/index';
import { ActionHandler } from './actions/index';
import { ResponseLogger } from './responses/index';
import { fetchTodayMatches, fetchLiveMatches } from './../runners/sportybet';
//import  {AnalystBot}  from '../analyst-bots/bot';
//import { GodComplex }       from '../gods_complex/index';   
export class HelperBot {
    triggerManager;
    actionHandler;
    responseLogger;
    //   private analystBot: AnalystBot;
    //   private godComplex: GodComplex;                         
    dailyInterval;
    liveInterval;
    constructor() {
        this.triggerManager = new TriggerManager();
        this.actionHandler = new ActionHandler();
        this.responseLogger = new ResponseLogger();
        //       this.analystBot = new AnalystBot();
        //       this.godComplex = new GodComplex();  
        this.initialize();
    }
    initialize() {
        this.setupListeners();
        this.startAllBots(); // Start both bots immediately
    }
    startAllBots() {
        console.log('🔌 Starting all runners...');
        // 1. Start Today Matches Bot (runs at midnight and every 24h)
        this.scheduleDailyTask(async () => {
            console.log('📅 Processing today\'s matches...');
            const todayData = await fetchTodayMatches();
            console.log('• Today matches fetched:', todayData.length);
            //           const analysedResults =await this.analystBot.processData(todayData, 'today');
            //           const gcResults       = await this.godComplex.process(todayData, 'live');
        });
        // 2. Start Live Matches Bot (runs immediately then every 3 mins)
        this.scheduleLiveTask(async () => {
            console.log('📅 Processing live\'s matches...');
            const liveData = await fetchLiveMatches();
            console.log('• Today matches fetched:', liveData.length);
            //            await this.analystBot.processData(liveData, 'live');
            //            const gcResults       = await this.godComplex.process(liveData, 'live');
        });
    }
    scheduleDailyTask(task) {
        task();
        const runAtMidnight = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const msUntilMidnight = midnight.getTime() - now.getTime();
            setTimeout(async () => {
                await task();
                this.dailyInterval = setInterval(task, 24 * 60 * 60 * 1000);
            }, msUntilMidnight);
        };
        runAtMidnight();
        console.log('⏰ Today matches bot scheduled for midnight and every 24h');
    }
    scheduleLiveTask(task) {
        // Run immediately
        task();
        // Then every 3 minutes
        this.liveInterval = setInterval(task, 3 * 60 * 1000);
        console.log('🔄 Live matches bot started (runs every 3 minutes)');
    }
    cleanup() {
        if (this.dailyInterval)
            clearInterval(this.dailyInterval);
        if (this.liveInterval)
            clearInterval(this.liveInterval);
        //      this.analystBot.cleanup();
        console.log('🧹 All bot intervals cleared');
    }
    setupListeners() {
        // Your existing trigger logic
        const predefinedReason = 'exampleReason';
    }
}
// Start everything
const bot = new HelperBot();
