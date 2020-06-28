using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Concerts.API.Models
{
    public class ConcertArtist
    {
        public int ConcertId { get; set; }
        public int ArtistId { get; set; }
        public Concert Concert { get; set; }
        public Artist Artist { get; set; }
    }
}
