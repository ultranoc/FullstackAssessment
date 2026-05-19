import { Pool, PoolConfig } from 'pg';
import { Product } from './models';

export class ScraperRepository {
  private readonly pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS Categories (
        Id   UUID PRIMARY KEY,
        Name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS Products (
        Id               UUID PRIMARY KEY,
        Name             TEXT        NOT NULL,
        Description      TEXT        NOT NULL,
        Price            NUMERIC     NOT NULL,
        ImageUrl         TEXT        NOT NULL,
        CategoryId       UUID        NOT NULL REFERENCES Categories(Id),
        AvailableAmount  INTEGER,
        CreatedAt        TIMESTAMPTZ NOT NULL,
        UpdatedAt        TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('Database initialized.');
  }

  async upsertProduct(product: Product): Promise<void> {
    await this.pool.query(
      `WITH cat AS (
         INSERT INTO Categories (Id, Name) VALUES (gen_random_uuid(), $1)
         ON CONFLICT (Name) DO UPDATE SET Name = EXCLUDED.Name
         RETURNING Id
       )
       INSERT INTO Products (Id, Name, Description, Price, ImageUrl, CategoryId, AvailableAmount, CreatedAt, UpdatedAt)
       VALUES ($2, $3, $4, $5, $6, (SELECT Id FROM cat), $7, $8, $9)
       ON CONFLICT (Id) DO UPDATE SET
         Name            = EXCLUDED.Name,
         Description     = EXCLUDED.Description,
         Price           = EXCLUDED.Price,
         ImageUrl        = EXCLUDED.ImageUrl,
         CategoryId      = EXCLUDED.CategoryId,
         AvailableAmount = EXCLUDED.AvailableAmount,
         CreatedAt       = EXCLUDED.CreatedAt,
         UpdatedAt       = EXCLUDED.UpdatedAt`,
      [
        product.categoryName,
        product.id,
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.availableAmount,
        product.createdAt,
        product.updatedAt,
      ],
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
