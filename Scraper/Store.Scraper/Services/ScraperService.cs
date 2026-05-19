using Microsoft.Extensions.Logging;
using Store.Scraper.Data;

namespace Store.Scraper.Services;

public class ScraperService
{
    protected readonly IScraperRepository Repository;
    protected readonly ILogger<ScraperService> Logger;

    public ScraperService(IScraperRepository repository, ILogger<ScraperService> logger)
    {
        Repository = repository;
        Logger = logger;
    }

    /// <summary>
    /// Collects products and persists them to the database.
    /// </summary>
    /// <remarks>
    /// Use Repository.UpsertProductAsync(product) to save each collected product.
    /// Use Guid.NewGuid() to generate an Id for each product.
    ///
    /// You decide how to collect the data — HttpClient, Playwright, HtmlAgilityPack, etc.
    /// </remarks>
    public virtual async Task ScrapeAsync()
    {
        // TODO: Implement the scraping logic here.
        throw new NotImplementedException("Implement the scraping logic here.");
    }
}
