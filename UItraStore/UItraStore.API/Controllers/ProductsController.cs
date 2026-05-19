using Microsoft.AspNetCore.Mvc;
using UItraStore.API.Data;

namespace UItraStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ProductRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        // TODO: Validate query parameters and return 400 Bad Request for invalid input.
        //
        //   pageSize  must be between 1 and 100 (inclusive)
        //   etc...
        //
        // Return a descriptive error message, e.g.:
        //   return BadRequest("pageSize must be between 1 and 100.");
        //
        // Hint: consider returning a ProblemDetails response (Problem(...))
        //       for a more standards-compliant error shape.

        var result = await repo.GetProductsAsync(search, category, minPrice, maxPrice, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var product = await repo.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }
}
