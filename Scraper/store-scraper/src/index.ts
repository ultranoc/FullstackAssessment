import { ScraperRepository } from './repository';
import { ScraperService } from './scraperService';

async function main(): Promise<void> {
    const repository = new ScraperRepository({
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME ?? 'StoreDb',
        user: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres',
    });

    await repository.initialize();

    const service = new ScraperService(repository);

    try {
        await service.scrape();

        console.log('\nDone');
    } finally {
        await repository.close();
    }
}

main().catch((err: unknown) => {
    console.error('Scraping failed:', err instanceof Error ? err.message : err);
    process.exit(1);
});
