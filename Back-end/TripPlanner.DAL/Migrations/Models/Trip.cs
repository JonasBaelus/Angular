namespace TripPlanner.DAL.Models
{
    public class Trip
    {
        public int TripId { get; set; }
        public String Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Picture { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public Boolean IsShared { get; set; }
        public ICollection<UserTrip>? Users { get; }
        public ICollection<TripActivity>? TripActivities { get; }
        public ICollection<TripKeyword>? TripKeywords { get; }
        public ICollection<TripCategory>? TripCategories { get; }
    }
}
