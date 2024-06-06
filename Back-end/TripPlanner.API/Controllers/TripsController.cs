using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TripPlanner.API.Dto.Pagination;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.Trip;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripsController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public TripsController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Trips
        [HttpGet]
        public async Task<ActionResult<List<TripRequest>>> GetTrips()
        {
            var trips = await _context.Trips.ToListAsync();

            if (trips == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<TripRequest>>(trips);
        }

        // GET: api/public-trips
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<TripRequest>))]
        [Route("public-trips")]
        public async Task<ActionResult<List<TripRequest>>> GetPublicTrips([FromQuery] TripParameters tripParameters)
        {
            var trips = _context.Trips.Include(a => a.TripActivities).ThenInclude(a => a.Activity).Include(c => c.TripCategories).ThenInclude(c => c.Category).Where(t => t.IsShared.Equals(true)).OrderBy(t => t.Name) as IQueryable<Trip>;

            if (trips == null)
            {
                return NotFound();
            }

            if (tripParameters == null)
            {
                throw new ArgumentNullException(nameof(tripParameters));
            }

            if (tripParameters.PageNumber == 0 & tripParameters.PageSize == 0)
            {
                throw new ArgumentNullException(nameof(tripParameters));
            }

            if (!string.IsNullOrWhiteSpace(tripParameters.SearchQuery))
            {
                var searchQuery = tripParameters.SearchQuery.Trim();
                trips = trips.Where(t => t.Name.ToLower().Contains(searchQuery.ToLower()));
            }

            if (tripParameters.Categories != null && tripParameters.Categories.Any())
            {
                // Convert list of strings to list of integers (category IDs)
                List<int> categoryIds = tripParameters.Categories
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                    .ToList();

                trips = trips.Where(t => t.TripCategories.Any(tc => categoryIds.Contains(tc.CategoryId)));
            }

            var paginationMetaData = new PaginationMetaData(trips.Count(), tripParameters.PageNumber, tripParameters.PageSize);
            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetaData));
            Response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

            var items = await trips.Skip((tripParameters.PageNumber - 1) * tripParameters.PageSize).Take(tripParameters.PageSize).ToListAsync();

            return Ok(_mapper.Map<List<TripRequest>>(items));
        }

        // GET: api/Trips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TripRequest>> GetTrip(int id)
        {
            var trip = await _context.Trips.Include(t => t.TripActivities).ThenInclude(t => t.Activity).FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
            {
                return NotFound();
            }

            return _mapper.Map<TripRequest>(trip);
        }

        // PUT: api/Trips/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<TripRequest>> PutTrip(int id, TripResponse putTrip)
        {
            if (id != putTrip.TripId)
            {
                return BadRequest();
            }

            Trip updatedTrip = _mapper.Map<Trip>(putTrip);
            var trip = _context.Trips.Where(u => u.TripId == id).FirstOrDefault();
            //_context.Entry(trip).State = EntityState.Modified;

            try
            {
                trip.Name = updatedTrip.Name;
                trip.StartDate = updatedTrip.StartDate;
                trip.EndDate = updatedTrip.EndDate;
                trip.Description = updatedTrip.Description;
                trip.Picture = updatedTrip.Picture;
                trip.Country = updatedTrip.Country;
                trip.City = updatedTrip.City;
                trip.IsShared = updatedTrip.IsShared;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripExists(id))
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

        // POST: api/Trips
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TripRequest>> PostTrip(TripResponse trip)
        {
            Trip newTrip = _mapper.Map<Trip>(trip);
            _context.Trips.Add(newTrip);
            await _context.SaveChangesAsync();
            TripRequest tripToReturn = _mapper.Map<TripRequest>(newTrip);

            return CreatedAtAction("GetTrip", new { id = tripToReturn.TripId }, tripToReturn);
        }

        // DELETE: api/Trips/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                return NotFound();
            }

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripExists(int id)
        {
            return _context.Trips.Any(e => e.TripId == id);
        }
    }
}
