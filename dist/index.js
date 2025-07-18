import { fetchLiveMatches, fetchTodayMatches } from './runners/sportybet.js';
async function main() {
    console.log('🚀 Fetching live matches...');
    const liveMatches = await fetchLiveMatches();
    console.log('✅ Live Matches:', liveMatches);
    console.log('\n🚀 Fetching today matches...');
    const todayMatches = await fetchTodayMatches();
    console.log(JSON.stringify(todayMatches, null, 2));
    // Keep process alive for now
    setInterval(() => { }, 60_000); // 1 minute no-op
}
main().catch((err) => {
    console.error('❌ Error in main:', err);
});
