using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Concerts.API.Data
{
    public class Concert : ConcertsDTO.Concert
    {
        public virtual ICollection<ConcertArtist> ConcertsArtists { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}
