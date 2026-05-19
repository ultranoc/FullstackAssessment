import { ScraperRepository } from './repository';

export class ScraperService {
  protected readonly repository: ScraperRepository;

  constructor(repository: ScraperRepository) {
    this.repository = repository;
  }

  /**
   * Collects products and persists them to the database.
   *
   * Use this.repository.upsertProduct(product) to save each collected product.
   * Use crypto.randomUUID() to generate a GUID for each product's id field.
   *
   * You decide how to collect the data — REST API, Playwright, etc.
   */
  async scrape(): Promise<void> {
    // TODO: Implement the scraping logic here.
    throw new Error('Not implemented: implement the scrape() method.');
  }
}
