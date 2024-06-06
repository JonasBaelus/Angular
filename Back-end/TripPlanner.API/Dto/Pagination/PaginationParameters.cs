namespace TripPlanner.API.Dto.Pagination
{
    public class PaginationParameters
    {
        private const int _maxPageSize = 25;

        public string SearchQuery { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        private int _pageSize { get; set; } = 5;



        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > _maxPageSize) ? _maxPageSize : value;
        }
    }
}
