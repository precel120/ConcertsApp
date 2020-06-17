using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Concerts.API.Data
{
    public class Ticket : ConcertsDTO.Ticket
    {
        public Client Client { get; set; }
        public Concert Concert { get; set; }
    }
}
