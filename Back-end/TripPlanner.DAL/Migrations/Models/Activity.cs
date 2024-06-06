namespace TripPlanner.DAL.Models
{
    public class Activity
    {
        public int ActivityId { get; set; }
        public string Name { get; set; }
        public ICollection<TripActivity>? TripActivities { get; }

    }
}
