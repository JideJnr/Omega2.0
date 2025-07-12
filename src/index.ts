import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚦 System initialized...');
console.log('🚦 Welcome Back !!!');
console.log('🚦 Standing by for your commands...');

(async () => {
  const subscriber = createClient({ url: process.env.REDIS_URL });
  await subscriber.connect();

  subscriber.subscribe('bot-control', (message) => {
    const { command } = JSON.parse(message);
    if (command === 'START_BOT') {
      console.log('🟢 Bot started by API command!');
      // runCourtroomService();
    } else if (command === 'STOP_BOT') {
      console.log('🔴 Bot stopped by API command!');
      // stop logic if needed
    }
  });

  // 👇 Minimal HTTP server to keep process alive on Render
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.get('/', (req, res) => {
    res.send('🤖 God Complex Bot is online');
  });

  app.listen(PORT, () => {
    console.log(`🌐 Bot HTTP server listening on port ${PORT}`);
  });
})();
