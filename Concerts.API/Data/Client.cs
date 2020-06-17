using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Concerts.API.Data
{
    public class Client : ConcertsDTO.Client
    {
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}
