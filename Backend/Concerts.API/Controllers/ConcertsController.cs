using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Concerts.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Concerts.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConcertsController : ControllerBase
    {
        public ConcertsController(ConcertsAppDBContext context)
        {
            _context = context;
        }

        private readonly ConcertsAppDBContext _context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Concert>>> GetConcerts()
        {
            var concerts = await _context.Concerts.AsNoTracking()
                .Include(a => a.ConcertsArtists)
                .ThenInclude(aa => aa.Artist)
                .ToListAsync();
            return concerts;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Concert>> GetConcert(int id)
        {
            var concert = await _context.Concerts.FindAsync(id);
            return concert;
        }

        [HttpPost]
        public async Task<ActionResult<Concert>> PostConcert(Concert concert)
        {
            _context.Add(concert);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetConcert", new { id = concert.Id }, concert);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Concert>> DeleteConcert(int id)
        {
            var concert = await _context.Concerts.FindAsync(id);
            if (concert == null)
            {
                return NotFound();
            }

            _context.Concerts.Remove(concert);
            await _context.SaveChangesAsync();
            return concert;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConcert(int id, Concert concert)
        {
            if (id != concert.Id)
            {
                return BadRequest();
            }

            _context.Entry(concert).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
