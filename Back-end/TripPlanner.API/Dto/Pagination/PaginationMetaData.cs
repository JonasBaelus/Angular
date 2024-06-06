namespace TripPlanner.API.Dto.Pagination
{
    public class PaginationMetaData
    {
        public PaginationMetaData(int totalCount, int currentPage, int itemsPerPage)
        {
            TotalItems = totalCount;
            CurrentPage = currentPage;
            TotalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);
            ItemsPerPage = itemsPerPage;
        }
        public int CurrentPage { get; private set; }

        public int ItemsPerPage { get; private set; }
        public int TotalItems { get; private set; }
        public int TotalPages { get; private set; }
    }
}
