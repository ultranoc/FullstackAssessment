using Microsoft.AspNetCore.Mvc;
using UItraStore.API.Data;

namespace UItraStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(CategoryRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await repo.GetAllAsync();
        return Ok(categories);
    }
}
