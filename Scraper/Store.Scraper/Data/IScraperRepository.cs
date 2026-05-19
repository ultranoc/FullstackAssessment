using Store.Scraper.Models;

namespace Store.Scraper.Data;

public interface IScraperRepository
{
    Task InitializeAsync();
    Task UpsertProductAsync(Product product);
}
