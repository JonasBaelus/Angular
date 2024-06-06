namespace TripPlannerAPI.Dto.Email
{
    public class EmailRequest
    {
        public string UserId { get; set; }
        public int TripId { get; set; }
        public string Email { get; set; }

    }
}
