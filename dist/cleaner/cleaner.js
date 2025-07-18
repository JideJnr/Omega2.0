export class SportyBetCleaner {
    static cleanMarket(market) {
        return {
            id: market.id,
            type: market.desc.replace(/\s+/g, '_').toLowerCase(), // e.g. '1X2' -> '1x2'
            specifier: market.specifier || '',
            outcomes: market.outcomes.map((out) => ({
                id: out.id,
                label: out.desc,
                odds: parseFloat(out.odds),
                probability: parseFloat(out.probability) || 0
            })),
            status: market.status
        };
    }
    static cleanEvent(event) {
        return {
            id: event.eventId,
            homeTeam: event.homeTeamName,
            awayTeam: event.awayTeamName,
            status: event.status, // 1 = live, 0 = upcoming
            score: event.setScore,
            markets: event.markets
                .filter((m) => m.status === 0) // Only active markets
                .map((m) => SportyBetCleaner.cleanMarket(m))
        };
    }
    static cleanTournament(tournament) {
        return {
            id: tournament.id,
            name: tournament.name,
            category: {
                id: tournament.categoryId,
                name: tournament.categoryName
            },
            events: tournament.events.map((evt) => SportyBetCleaner.cleanEvent(evt))
        };
    }
    static cleanData(rawData) {
        return {
            timestamp: Date.now(),
            tournaments: rawData.data.map((t) => SportyBetCleaner.cleanTournament(t))
        };
    }
}
