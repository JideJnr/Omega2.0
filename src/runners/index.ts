import { fetchLiveMatches, fetchTodayMatches } from './sportybet';


export class CrawlerCoordinator {
  private isRunning = false;

  async start() {
    this.isRunning = true;
    console.log('🕷️ Crawler system online');
    
    // Initial fetch
    await this.executeCrawlCycle();
    
    // Periodic execution (every 5 mins)
    setInterval(() => this.executeCrawlCycle(), 300_000);
  }

  private async executeCrawlCycle() {
    try {
      console.log('🔍 Crawling all sources...');
      
      const results = await Promise.allSettled([
        this.fetchSportyBetData(),
        // this.fetchOtherSourceData() 
      ]);
      
      return results.filter(r => r.status === 'fulfilled');
    } catch (err) {
      console.error('⚠️ Crawl cycle failed:', err);
    }
  }

  private async fetchSportyBetData() {
    const todayMatches = await fetchTodayMatches();
    const liveMatches = await fetchLiveMatches();
    return { source: 'sportybet', data: { todayMatches, liveMatches } };
  }
}