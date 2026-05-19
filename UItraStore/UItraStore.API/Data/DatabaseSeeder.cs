using Bogus;
using UItraStore.API.Models;

namespace UItraStore.API.Data;

public static class DatabaseSeeder
{
    public static (List<Category> Categories, List<Product> Products) Generate(int productCount)
    {
        var faker = new Faker();

        var categories = faker.Commerce.Categories(10)
            .Distinct()
            .Select(name => new Category { Id = Guid.NewGuid(), Name = name })
            .ToList();

        var products = new Faker<Product>()
            .RuleFor(p => p.Id, f => f.Random.Guid())
            .RuleFor(p => p.Name, f => f.Commerce.ProductName())
            .RuleFor(p => p.Description, f => f.Lorem.Sentence(12))
            .RuleFor(p => p.Price, f => Math.Round(f.Random.Decimal(5, 999), 2))
            .RuleFor(p => p.ImageUrl, f => f.Image.PicsumUrl())
            .RuleFor(p => p.CategoryId, f => f.PickRandom(categories).Id)
            .RuleFor(p => p.AvailableAmount, f => f.Random.Bool(0.8f) ? f.Random.Int(0, 200) : null)
            .RuleFor(p => p.CreatedAt, f => f.Date.Past(1).ToUniversalTime())
            .RuleFor(p => p.UpdatedAt, (f, p) => f.Date.Between(p.CreatedAt, DateTime.UtcNow).ToUniversalTime())
            .Generate(productCount);

        return (categories, products);
    }
}
