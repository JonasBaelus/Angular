using TripPlannerAPI.Dto.TripActivity;
using TripPlannerAPI.Dto.TripCategory;

namespace TripPlannerAPI.Dto.Trip
{
    public class TripRequest
    {
        public int TripId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Picture { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public bool IsShared { get; set; }
        public ICollection<TripActivityRequest> Activities { get; set; }
        public ICollection<TripCategoryRequest> Categories { get; set; }
    }
}
