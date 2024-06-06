using TripPlannerAPI.Dto.Activity;

namespace TripPlannerAPI.Dto.TripActivity
{
    public class TripActivityRequest
    {
        public int TripActivityId { get; set; }
        public int ActivityId { get; set; }
        public int TripId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int Participants { get; set; }
        public String? Review { get; set; }
        public int? Score { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ActivityRequest Activity { get; set; }
        public Array contributors { get; set; }
    }
}
