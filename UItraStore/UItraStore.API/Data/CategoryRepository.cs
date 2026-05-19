using Dapper;
using Npgsql;
using UItraStore.API.Models;

namespace UItraStore.API.Data;

public class CategoryRepository(string connectionString)
{
    private NpgsqlConnection CreateConnection() => new(connectionString);

    public async Task<bool> EnsureCreatedAsync()
    {
        using var conn = CreateConnection();
        await conn.OpenAsync();

        var exists = await conn.ExecuteScalarAsync<bool>("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'categories'
            );
            """);

        if (exists) return false;

        await conn.ExecuteAsync("""
            CREATE TABLE Categories (
                Id   UUID PRIMARY KEY,
                Name TEXT NOT NULL UNIQUE
            );
            """);

        return true;
    }

    public async Task SeedAsync(IEnumerable<Category> categories)
    {
        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            "INSERT INTO Categories (Id, Name) VALUES (@Id, @Name)",
            categories);
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var conn = CreateConnection();
        return await conn.QueryAsync<Category>("SELECT * FROM Categories ORDER BY Name");
    }
}
