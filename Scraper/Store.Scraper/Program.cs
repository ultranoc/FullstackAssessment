using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Store.Scraper.Data;
using Store.Scraper.Services;

var services = new ServiceCollection();

services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.SetMinimumLevel(LogLevel.Information);
});

var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=StoreDb;Username=postgres;Password=postgres";
services.AddSingleton<IScraperRepository>(sp =>
    new ScraperRepository(connectionString, sp.GetRequiredService<ILogger<ScraperRepository>>()));

services.AddScoped<ScraperService>();

var provider = services.BuildServiceProvider();

var repository = provider.GetRequiredService<IScraperRepository>();
await repository.InitializeAsync();

var scraper = provider.GetRequiredService<ScraperService>();
await scraper.ScrapeAsync();

Console.WriteLine("\nDone");
