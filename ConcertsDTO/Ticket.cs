using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConcertsDTO
{
    public class Ticket
    {
        public int Id { get; set; }
        public float? Price { get; set; }
        public DateTimeOffset? TimeOfPurchase { get; set; }
    }
}
