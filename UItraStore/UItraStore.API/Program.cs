using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using UItraStore.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddServer(new OpenApiServer { Url = "http://localhost:5100" });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=StoreDb;Username=postgres;Password=postgres";
builder.Services.AddSingleton(_ => new ProductRepository(connectionString));
builder.Services.AddSingleton(_ => new CategoryRepository(connectionString));

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

var categoryRepo = app.Services.GetRequiredService<CategoryRepository>();
var productRepo = app.Services.GetRequiredService<ProductRepository>();
if (await categoryRepo.EnsureCreatedAsync())
{
    await productRepo.EnsureCreatedAsync();
    app.Logger.LogInformation("Tables created — seeding categories and 100 products.");
    var (categories, products) = DatabaseSeeder.Generate(100);
    await categoryRepo.SeedAsync(categories);
    await productRepo.SeedAsync(products);
}

app.UseCors();
app.UseSwagger();
app.MapScalarApiReference(options =>
{
    options.WithOpenApiRoutePattern("/swagger/v1/swagger.json");
    options.BaseServerUrl = "http://localhost:5100";
});
app.MapControllers();
app.Run();
