using Dapper;
using Microsoft.Extensions.Logging;
using Npgsql;
using Store.Scraper.Models;

namespace Store.Scraper.Data;

public class ScraperRepository : IScraperRepository
{
    private readonly string _connectionString;
    private readonly ILogger<ScraperRepository> _logger;

    public ScraperRepository(string connectionString, ILogger<ScraperRepository> logger)
    {
        _connectionString = connectionString;
        _logger = logger;
    }

    private NpgsqlConnection CreateConnection() => new(_connectionString);

    public async Task InitializeAsync()
    {
        using var conn = CreateConnection();
        await conn.OpenAsync();

        await conn.ExecuteAsync("""
            CREATE TABLE IF NOT EXISTS Categories (
                Id   UUID PRIMARY KEY,
                Name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS Products (
                Id               UUID PRIMARY KEY,
                Name             TEXT NOT NULL,
                Description      TEXT NOT NULL,
                Price            NUMERIC NOT NULL,
                ImageUrl         TEXT NOT NULL,
                CategoryId       UUID NOT NULL REFERENCES Categories(Id),
                AvailableAmount  INTEGER,
                CreatedAt        TIMESTAMPTZ NOT NULL,
                UpdatedAt        TIMESTAMPTZ NOT NULL
            );
            """);

        _logger.LogInformation("Database initialized.");
    }

    public async Task UpsertProductAsync(Product product)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync("""
            WITH cat AS (
                INSERT INTO Categories (Id, Name) VALUES (gen_random_uuid(), @CategoryName)
                ON CONFLICT (Name) DO UPDATE SET Name = EXCLUDED.Name
                RETURNING Id
            )
            INSERT INTO Products (Id, Name, Description, Price, ImageUrl, CategoryId, AvailableAmount, CreatedAt, UpdatedAt)
            VALUES (@Id, @Name, @Description, @Price, @ImageUrl, (SELECT Id FROM cat), @AvailableAmount, @CreatedAt, @UpdatedAt)
            ON CONFLICT(Id) DO UPDATE SET
                Name            = excluded.Name,
                Description     = excluded.Description,
                Price           = excluded.Price,
                ImageUrl        = excluded.ImageUrl,
                CategoryId      = excluded.CategoryId,
                AvailableAmount = excluded.AvailableAmount,
                CreatedAt       = excluded.CreatedAt,
                UpdatedAt       = excluded.UpdatedAt;
            """, product);
    }
}
