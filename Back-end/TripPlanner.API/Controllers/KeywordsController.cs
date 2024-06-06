using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.DAL.Models;
using TripPlannerAPI.Data;
using TripPlannerAPI.Dto.Keyword;

namespace TripPlannerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KeywordsController : ControllerBase
    {
        private readonly TripContext _context;
        private readonly IMapper _mapper;

        public KeywordsController(TripContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Keywords
        [HttpGet]
        public async Task<ActionResult<List<KeywordRequest>>> GetKeywords()
        {

            var keywords = await _context.Keywords.ToListAsync();

            if (keywords == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<KeywordRequest>>(keywords);
        }

        // GET: api/Keywords/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KeywordRequest>> GetKeyword(int id)
        {
            var keyword = await _context.Keywords.FindAsync(id);

            if (keyword == null)
            {
                return NotFound();
            }

            return _mapper.Map<KeywordRequest>(keyword);
        }

        // PUT: api/Keywords/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<KeywordRequest>> PutKeyword(int id, KeywordResponse putKeyword)
        {
            if (id != putKeyword.KeywordId)
            {
                return BadRequest();
            }

            Keyword updatedKeyword = _mapper.Map<Keyword>(putKeyword);
            var keyword = _context.Keywords.Where(u => u.KeywordId == id).FirstOrDefault();
            _context.Entry(keyword).State = EntityState.Modified;

            try
            {
                keyword.Name = updatedKeyword.Name;
                keyword.Description = updatedKeyword.Description;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KeywordExists(id))
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

        // POST: api/Keywords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KeywordRequest>> PostKeyword(KeywordResponse keyword)
        {
            Keyword newKeyword = _mapper.Map<Keyword>(keyword);
            _context.Keywords.Add(newKeyword);
            await _context.SaveChangesAsync();
            KeywordRequest keywordToReturn = _mapper.Map<KeywordRequest>(newKeyword);

            return CreatedAtAction("GetKeyword", new { id = keywordToReturn.KeywordId }, keywordToReturn);
        }

        // DELETE: api/Keywords/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKeyword(int id)
        {
            var keyword = await _context.Keywords.FindAsync(id);
            if (keyword == null)
            {
                return NotFound();
            }

            _context.Keywords.Remove(keyword);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KeywordExists(int id)
        {
            return _context.Keywords.Any(e => e.KeywordId == id);
        }
    }
}
