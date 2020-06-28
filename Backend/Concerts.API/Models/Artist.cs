using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Concerts.API.Models
{
    public class Artist : ConcertsDTO.Artist
    {
        public virtual ICollection<ConcertArtist> ConcertsArtists { get; set; }
    }
}
