using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Concerts.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Concerts.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        public ArtistsController(ConcertsAppDBContext context)
        {
            _context = context;
        }

        private readonly ConcertsAppDBContext _context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artist>>> GetArtists()
        {
            var artists = await _context.Artists.AsNoTracking()
                .Include(c => c.ConcertsArtists)
                .ThenInclude(cc => cc.Concert)
                .ToListAsync();
            return artists;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Artist>> GetArtist(int id)
        {
            var artists = await _context.Artists.FindAsync(id);
            return artists;
        }

        [HttpPost]
        public async Task<ActionResult<Artist>> PostArtist(Artist artist)
        {
            _context.Add(artist);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetArtist", new { id = artist.Id }, artist);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Artist>> DeleteArtist(int id)
        {
            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
            {
                return NotFound();
            }

            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();
            return artist;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtist(int id, Artist artist)
        {
            if (id != artist.Id)
            {
                return BadRequest();
            }

            _context.Entry(artist).State = EntityState.Modified;

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
