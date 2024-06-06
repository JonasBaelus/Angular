using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.TripKeyword;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripKeywordsController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public TripKeywordsController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/TripKeywords
        [HttpGet]
        public async Task<ActionResult<List<TripKeywordRequest>>> GetTripKeywords()
        {
            var tripKeywords = await _context.TripKeywords.ToListAsync();

            if (tripKeywords == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<TripKeywordRequest>>(tripKeywords);
        }

        // GET: api/TripKeywords/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TripKeywordRequest>> GetTripKeyword(int id)
        {
            var tripKeyword = await _context.TripKeywords.FindAsync(id);

            if (tripKeyword == null)
            {
                return NotFound();
            }

            return _mapper.Map<TripKeywordRequest>(tripKeyword);
        }

        // PUT: api/TripKeywords/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<TripKeywordRequest>> PutTripKeyword(int tripId, int keywordId, TripKeywordResponse putTripKeyword)
        {
            if (tripId != putTripKeyword.TripId || keywordId != putTripKeyword.KeywordId)
            {
                return BadRequest();
            }

            TripKeyword updatedTripKeyword = _mapper.Map<TripKeyword>(putTripKeyword);
            var tripKeyword = _context.TripKeywords.Where(u => u.TripId == tripId && u.KeywordId == keywordId).FirstOrDefault();
            _context.Entry(putTripKeyword).State = EntityState.Modified;

            try
            {
                tripKeyword.TripId = updatedTripKeyword.TripId;
                tripKeyword.KeywordId = updatedTripKeyword.KeywordId;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TripKeywords.Any(tc => tc.TripId == tripId && tc.KeywordId == keywordId))
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

        // POST: api/TripKeywords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TripKeywordRequest>> PostTripKeyword(TripKeywordResponse tripKeyword)
        {
            TripKeyword newTripKeyword = _mapper.Map<TripKeyword>(tripKeyword);
            _context.TripKeywords.Add(newTripKeyword);
            TripKeywordRequest tripKeywordToReturn = _mapper.Map<TripKeywordRequest>(newTripKeyword);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TripKeywordExists(tripKeyword.TripId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTripKeyword", new { tripId = tripKeywordToReturn.TripId, tripKeywordToReturn = tripKeywordToReturn.KeywordId }, tripKeywordToReturn);
        }

        // DELETE: api/TripKeywords/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripKeyword(int id)
        {
            var tripKeyword = await _context.TripKeywords.FindAsync(id);
            if (tripKeyword == null)
            {
                return NotFound();
            }

            _context.TripKeywords.Remove(tripKeyword);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripKeywordExists(int id)
        {
            return _context.TripKeywords.Any(e => e.TripId == id);
        }
    }
}
