namespace TripPlanner.DAL.Models
{
    public class Keyword
    {
        public int KeywordId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<TripKeyword>? TripKeywords { get; }
    }
}
