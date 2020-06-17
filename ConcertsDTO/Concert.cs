using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ConcertsDTO
{
    public class Concert
    {
        public int Id { get; set; }
        [StringLength(200)]
        public string Name { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        [StringLength(1000)]
        public string Location { get; set; }
        [StringLength(4000)]
        public string Description { get; set; }
    }
}
