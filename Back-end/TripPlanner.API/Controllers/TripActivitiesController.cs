using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.TripActivity;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripActivitiesController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public TripActivitiesController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/TripActivities
        [HttpGet]
        public async Task<ActionResult<List<TripActivityRequest>>> GetTripActivities()
        {
            var tripActivities = await _context.TripActivities.ToListAsync();

            if (tripActivities == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<TripActivityRequest>>(tripActivities);
        }

        // GET: api/TripActivities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TripActivityRequest>> GetTripActivity(int id)
        {
            var tripActivity = await _context.TripActivities.FindAsync(id);

            if (tripActivity == null)
            {
                return NotFound();
            }

            return _mapper.Map<TripActivityRequest>(tripActivity);
        }

        // PUT: api/TripActivities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<TripActivityRequest>> PutTripActivity(int id, TripActivityResponse putTripActivity)
        {
            if (id != putTripActivity.TripActivityId)
            {
                return BadRequest();
            }
            TripActivity updatedTripActivity = _mapper.Map<TripActivity>(putTripActivity);
            var tripActivity = _context.TripActivities.Where(u => u.TripActivityId == id).FirstOrDefault();

            if (tripActivity == null)
            {
                return NotFound();
            }

            try
            {
                tripActivity.ActivityId = putTripActivity.ActivityId;
                tripActivity.TripId = putTripActivity.TripId;
                tripActivity.Name = putTripActivity.Name;
                tripActivity.Description = putTripActivity.Description;
                tripActivity.StartDate = putTripActivity.StartDate;
                tripActivity.EndDate = putTripActivity.EndDate;
                tripActivity.Participants = putTripActivity.Participants;
                tripActivity.Review = putTripActivity.Review;
                tripActivity.Score = putTripActivity.Score;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripActivityExists(id))
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

        // POST: api/TripActivities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TripActivityRequest>> PostTripActivity(TripActivityResponse tripActivity)
        {
            TripActivity newTripActivity = _mapper.Map<TripActivity>(tripActivity);
            _context.TripActivities.Add(newTripActivity);
            await _context.SaveChangesAsync();
            TripActivityRequest tripActivityToReturn = _mapper.Map<TripActivityRequest>(newTripActivity);

            return CreatedAtAction("GetTripActivity", new { id = tripActivityToReturn.TripActivityId }, tripActivityToReturn);
        }

        // DELETE: api/TripActivities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripActivity(int id)
        {
            var tripActivity = await _context.TripActivities.FindAsync(id);
            if (tripActivity == null)
            {
                return NotFound();
            }

            _context.TripActivities.Remove(tripActivity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripActivityExists(int id)
        {
            return _context.TripActivities.Any(e => e.TripActivityId == id);
        }
    }
}
