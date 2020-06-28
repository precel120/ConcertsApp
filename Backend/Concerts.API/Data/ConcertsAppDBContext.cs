using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Concerts.API.Models
{
    public class ConcertsAppDBContext : DbContext
    {
        public ConcertsAppDBContext(DbContextOptions<ConcertsAppDBContext> options) : base(options) {}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Many-to-many: Concert <-> Artist
            modelBuilder.Entity<ConcertArtist>()
                .HasKey(ca => new { ca.ConcertId, ca.ArtistId });
        }
        public DbSet<Concert> Concerts { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ConcertArtist> ConcertsArtists { get; set; }
    }
}
