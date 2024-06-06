using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TripPlanner.DAL.Models
{
    public class UserTrip
    {
        public string UserId { get; set; } 
        public int TripId { get; set; }
        public Trip? Trip { get; }

    }
}
