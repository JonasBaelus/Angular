using TripPlannerAPI.Dto.Category;

namespace TripPlannerAPI.Dto.TripCategory
{
    public class TripCategoryRequest
    {
        public int TripId { get; set; }
        public int CategoryId { get; set; }
        public CategoryRequest Category { get; set; }
    }
}
