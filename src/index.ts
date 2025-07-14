// index.js
import { HelperBot } from './helper-bots/bot';
import { createClient } from 'redis';

console.log('🚦 System initialized...');
console.log('🚦 Welcome Back !!! ');
console.log('🚦 Standing by for your commands...');

const redisSubscriber = createClient({ url: process.env.REDIS_URL });
await redisSubscriber.connect();

let helperBot: HelperBot | null = null;
let isRunning = false;
helperBot = new HelperBot();
helperBot.initialize();

redisSubscriber.subscribe('bot-control', async (message) => {
  const { command } = JSON.parse(message);

  if (command === 'START_BOT' && !isRunning) {
    isRunning = true;
    console.log('🟢 Command received...  ');


    helperBot = new HelperBot();
    helperBot.initialize();
    console.log('   • HelperBot started');

    console.log('✅  Lights have been switched on...');
  }

  else if (command === 'STOP_BOT' && isRunning) {
    console.log('🔴 GOODBYE SIR — ');

    // 1) Stop HelperBot
    helperBot?.cleanup();
    helperBot = null;
    console.log('• HelperBot stopped');

    // 2) (Future) stop other bots
    // stopSportybetBot();
    // stopMLAnalyzerBot();

    isRunning = false;
    console.log('✅ Switching off the light…');
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT caught — cleaning up before exit…');
  if (helperBot) helperBot.cleanup();
  // if you have other bots running, stop them here too
  process.exit(0);
});
