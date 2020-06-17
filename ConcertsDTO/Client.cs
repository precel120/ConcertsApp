using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConcertsDTO
{
    public class Client
    {
        public int Id { get; set; }
        [Required]
        [StringLength(40)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(60)]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        public int? PhoneNumber { get; set; }
    }
}
