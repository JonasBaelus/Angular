using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.TripCategory;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripCategoriesController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public TripCategoriesController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/TripCategories
        [HttpGet]
        public async Task<ActionResult<List<TripCategoryRequest>>> GetTripCategories()
        {
            var tripCategories = await _context.TripCategories.ToListAsync();

            if (tripCategories == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<TripCategoryRequest>>(tripCategories);
        }

        // GET: api/TripCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TripCategoryRequest>> GetTripCategory(int id)
        {
            var tripCategory = await _context.TripCategories.FindAsync(id);

            if (tripCategory == null)
            {
                return NotFound();
            }

            return _mapper.Map<TripCategoryRequest>(tripCategory);
        }

        // PUT: api/TripCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<TripCategoryRequest>> PutTripCategory(int tripId, int categoryId, TripCategoryResponse putTripCategory)
        {
            if (tripId != putTripCategory.TripId || categoryId != putTripCategory.CategoryId)
            {
                return BadRequest();
            }

            TripCategory updatedTripCategory = _mapper.Map<TripCategory>(putTripCategory);
            var tripCategory = _context.TripCategories.Where(u => u.TripId == tripId && u.CategoryId == categoryId).FirstOrDefault();
            _context.Entry(putTripCategory).State = EntityState.Modified;

            try
            {
                tripCategory.TripId = putTripCategory.TripId;
                tripCategory.CategoryId = putTripCategory.CategoryId;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TripCategories.Any(tc => tc.TripId == tripId && tc.CategoryId == categoryId))
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

        // POST: api/TripCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TripCategoryRequest>> PostTripCategory(TripCategoryResponse tripCategory)
        {
            TripCategory newTripCategory = _mapper.Map<TripCategory>(tripCategory);
            _context.TripCategories.Add(newTripCategory);
            TripCategoryRequest tripCategoryToReturn = _mapper.Map<TripCategoryRequest>(newTripCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TripCategoryExists(tripCategory.TripId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTripCategory", new { tripId = tripCategoryToReturn.TripId, categoryId = tripCategoryToReturn.CategoryId }, tripCategoryToReturn);
        }

        // DELETE: api/TripCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripCategory(int id)
        {
            var tripCategory = await _context.TripCategories.FindAsync(id);
            if (tripCategory == null)
            {
                return NotFound();
            }

            _context.TripCategories.Remove(tripCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripCategoryExists(int id)
        {
            return _context.TripCategories.Any(e => e.TripId == id);
        }
    }
}
