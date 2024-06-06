namespace TripPlanner.DAL.Models
{
    public class TripActivity
    {
        public int TripActivityId { get; set; }
        public int ActivityId { get; set; }
        public int TripId { get; set; }
        public String Name { get; set; }
        public String? Description { get; set; }
        public int Participants { get; set; }
        public String? Review { get; set; }
        public int? Score { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public Activity? Activity { get; }
        public Trip? Trip { get; }
    }
}
