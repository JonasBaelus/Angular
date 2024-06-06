namespace TripPlanner.API.Dto.Pagination
{
    public class TripParameters
    {
        private const int _maxPageSize = 25;

        public string SearchQuery { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        private int _pageSize { get; set; } = 5;

        public string Categories { get; set; } = string.Empty;



        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > _maxPageSize) ? _maxPageSize : value;
        }
    }
}
