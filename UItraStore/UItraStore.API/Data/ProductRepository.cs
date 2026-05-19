using Dapper;
using Npgsql;
using UItraStore.API.Models;

namespace UItraStore.API.Data;

public class ProductRepository(string connectionString)
{
    private NpgsqlConnection CreateConnection() => new(connectionString);

    public async Task EnsureCreatedAsync()
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync("""
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
    }

    public async Task SeedAsync(IEnumerable<Product> products)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync("""
            INSERT INTO Products (Id, Name, Description, Price, ImageUrl, CategoryId, AvailableAmount, CreatedAt, UpdatedAt)
            VALUES (@Id, @Name, @Description, @Price, @ImageUrl, @CategoryId, @AvailableAmount, @CreatedAt, @UpdatedAt)
            """, products);
    }

    public async Task<PagedResult<Product>> GetProductsAsync(
        string? search, string? category, decimal? minPrice, decimal? maxPrice, int page, int pageSize)
    {
        using var conn = CreateConnection();

        // TODO: Build a dynamic WHERE clause from the provided filter parameters.
        //
        // Supported filters:
        //   search    — case-insensitive partial match on Name OR Description
        //   category  — exact match on CategoryName (case-insensitive)
        //   minPrice  — lower bound on Price (inclusive)
        //   maxPrice  — upper bound on Price (inclusive)
        //
        // TODO: Add pagination.

        var allItems = (await conn.QueryAsync<Product>("""
            SELECT p.*, c.Name AS CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryId = c.Id
            ORDER BY p.Name
            """)).ToList();

        return new PagedResult<Product>
        {
            Items = allItems,
            TotalCount = allItems.Count,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
