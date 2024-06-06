using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TripPlanner.API.Dto.Pagination;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.Category;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        // GET: api/Categories
        [HttpGet]
        [Route("paginated-categories")]
        [ProducesResponseType(200, Type = typeof(List<CategoryRequest>))]
        public async Task<ActionResult<List<CategoryRequest>>> GetPaginatedCategories([FromQuery] PaginationParameters categoryParameters)
        {
            var categories = _context.Categories as IQueryable<Category>;

            if (categories == null)
            {
                return NotFound();
            }

            if (categoryParameters == null)
            {
                throw new ArgumentNullException(nameof(categoryParameters));
            }

            if (categoryParameters.PageNumber == 0 & categoryParameters.PageSize == 0)
            {
                throw new ArgumentNullException(nameof(categoryParameters));
            }

            if (!string.IsNullOrWhiteSpace(categoryParameters.SearchQuery))
            {
                var searchQuery = categoryParameters.SearchQuery.Trim();
                categories = categories.Where(a => a.Name.ToLower().Contains(searchQuery.ToLower()));
            }

            var paginationMetaData = new PaginationMetaData(categories.Count(), categoryParameters.PageNumber, categoryParameters.PageSize);
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
            Response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

            var items = await categories.Skip((categoryParameters.PageNumber - 1) * categoryParameters.PageSize).Take(categoryParameters.PageSize).ToListAsync();

            return Ok(_mapper.Map<List<CategoryRequest>>(items));
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryRequest>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            if (categories == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<CategoryRequest>>(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CategoryRequest>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return _mapper.Map<CategoryRequest>(category);
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "DeleteAccess")]
        public async Task<ActionResult<CategoryRequest>> PutCategory(int id, CategoryResponse putCategory)
        {
            if (id != putCategory.CategoryId)
            {
                return BadRequest();
            }

            //Category updatedCategory = _mapper.Map<Category>(putCategory);
            //var category = _context.Categories.Where(u => u.CategoryId == id).FirstOrDefault();
            //_context.Entry(category).State = EntityState.Modified;
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            // Map the updated fields from the DTO to the Category entity
            _mapper.Map(putCategory, category);

            try
            {
                //category.Name = updatedCategory.Name;
                //category.Description = updatedCategory.Description;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Categories/create
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("create")]
        [Authorize(Policy = "DeleteAccess")]
        public async Task<ActionResult<CategoryRequest>> PostCategory(CategoryResponse category)
        {
            Category newCategory = _mapper.Map<Category>(category);
            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();
            CategoryRequest categoryToReturn = _mapper.Map<CategoryRequest>(newCategory);

            return CreatedAtAction("GetCategory", new { id = categoryToReturn.CategoryId }, categoryToReturn);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "DeleteAccess")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }
    }
}
