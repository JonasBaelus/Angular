using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using TripPlannerAPI.Dto.Email;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using TripPlanner.API.Dto.ContactEmail;
using Microsoft.Data.SqlClient.Server;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace TripPlanner.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly ILogger<EmailController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpClientFactory _httpClientFactory;

        public EmailController(ILogger<EmailController> logger, IConfiguration configuration, IWebHostEnvironment hostingEnvironment, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("submitForm")]
        public async Task<IActionResult> SubmitForm([FromForm] string userId, [FromForm] int tripId)
        {
            try
            {
                string baseUrl = GetBaseUrl();
                string token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxcDY1aVhLMEUwa0FnN2JBUU4tMyJ9.eyJpc3MiOiJodHRwczovL2Rldi0ya2k4bmltMGEzdnJid3cxLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJWc1dtdm1hZVpycVg0bE1ISkNqallhSWdqUWI4Q0JKdUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzExMyIsImlhdCI6MTcwMTk3NTUzMCwiZXhwIjoxNzAyMDYxOTMwLCJhenAiOiJWc1dtdm1hZVpycVg0bE1ISkNqallhSWdqUWI4Q0JKdSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbXX0.ro595BCWCl1b6TTxNMmf8IADE2zyFMAaIiRXO5pFXCnYUu_czp7yCBC5qoYKiJBOL8mrrpyCCLgHZik5GUjWFNLdOyCdd3epuVoAgaVrk4V5TLZKOo0J5Kw5R7WJpOci67YatTfJCAW9XsE-bMtkFL4TrmGbwADFx-plavPO92hhWFJLVVAbRsVM_2e6_m85HhUTJW2DPvRJhOGNH8N5aYTJU9Xax-VWFuQ42gYMgRt1N0yzq2lSpIAhONLyFvclGhGF2jQ8PZNjdhdgIOkOUioAxc90iqwbzU08hi9Qij-ZHWX-HWhVFmP2Uo7nTLgQYRvgXQV_Fetu2kDKdJPG2A";

                string url = $"{baseUrl}/UserTrips/{userId}/{tripId}";


                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Headers = {
                        { HttpRequestHeader.Authorization.ToString(), $"Bearer {token}" },
                        { HttpRequestHeader.Accept.ToString(), "application/json" },
                        { HttpRequestHeader.ContentType.ToString(), "application/json; charset=utf-8" }, // Set Content-Type header
                        { "X-Version", "1" }
                    },
                };

                _logger.LogInformation($"Making POST request to: {url}");

                var response = client.SendAsync(httpRequestMessage).Result;

                _logger.LogInformation($"Response status code: {response.StatusCode}");


                // Check the response status
                if (_hostingEnvironment.IsDevelopment())
                {
                    return Redirect("http://localhost:4200/");
                }
                else
                {
                    return Redirect("https://trip-planner-46730.web.app/");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred: {ex.Message}");
                return StatusCode(500, new { Message = "Internal server error" });
            }
        }

        private string GetBaseUrl()
        {
            return _hostingEnvironment.IsProduction()
                ? _configuration.GetConnectionString("BaseUrlProduction")
                : _configuration.GetConnectionString("BaseUrlLocal");
        }

        [HttpPost]
        [Authorize]
        public IActionResult SendEmail([FromBody] EmailRequest emailRequest)
        {
            try
            {
                string emailAddress = emailRequest.Email;
                string userId = emailRequest.UserId;
                int tripId = emailRequest.TripId;

                var baseUrl = _hostingEnvironment.IsProduction() ?
                _configuration.GetConnectionString("BaseUrlProduction") :
                _configuration.GetConnectionString("BaseUrlLocal");

                Debug.WriteLine(baseUrl);

                // Create and configure the SMTP client
                using (var smtpClient = new SmtpClient("smtp-auth.mailprotect.be"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("tripplanner@kmaa.be", "admin1234!");
                    smtpClient.EnableSsl = true;
                    smtpClient.UseDefaultCredentials = false;

                    // Create the email message
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("tripplanner@kmaa.be"),
                        Subject = "Invite Trip Planner",
                        Body = $@"<html>
                        <body>
                            <p>Hey,</p>
                            <p>You have been invited to contribute to a trip.</p>
                            <p>Click the button below to start contributing:</p>
                            <form action=""{baseUrl}/Email/submitForm"" method=""post"">
                               <input type=""hidden"" name=""userId"" value=""{userId}"" />
                               <input type=""hidden"" name=""tripId"" value=""{tripId}"" />
                    
                               <input type=""hidden"" name=""emailAddress"" value=""{emailAddress}"" />
                               <button type=""submit"" style=""cursor:pointer; display:inline-block; padding:10px 20px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:5px; border: none;"">Contribute to Trip</button>
                            </form>
                            <p>If you have any questions or need more details about the trip, feel free to contact the trip organizer at <a href=""mailto:organizer@tripplanner.com"" style=""color:#007BFF; text-decoration:none;"">organizer@tripplanner.com</a></p>
                            <p>Best Regards,<br/>Trip Planner Team</p>
                        </body>
                        </html>",
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(emailAddress);

                    // Send the email
                    smtpClient.Send(mailMessage);

                    _logger.LogInformation("Email sent successfully");
                    return Ok(new { Message = "Email sent successfully" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending email: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Error = $"Error sending email: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("contact-email")]
        public IActionResult SendContactEmail([FromBody] ContactEmailRequest emailRequest)
        {
            try
            {
                string emailAddress = emailRequest.Email;
                string contactMessage = emailRequest.Message;

                var baseUrl = _hostingEnvironment.IsProduction() ?
                _configuration.GetConnectionString("BaseUrlProduction") :
                _configuration.GetConnectionString("BaseUrlLocal");

                Debug.WriteLine(baseUrl);

                // Create and configure the SMTP client
                using (var smtpClient = new SmtpClient("smtp-auth.mailprotect.be"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("tripplanner@kmaa.be", "admin1234!");
                    smtpClient.EnableSsl = true;
                    smtpClient.UseDefaultCredentials = false;

                    // Create the email message
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("tripplanner@kmaa.be"),
                        Subject = "Feedback contact form",
                        Body = $@"<html>
                        <body>
                            <p>Message from {emailAddress}:</p>
                            <p>{contactMessage}</>
                        </body>
                        </html>",
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add("JonasBaelusBeerse@gmail.com");

                    // Send the email
                    smtpClient.Send(mailMessage);

                    _logger.LogInformation("Email sent successfully");
                    return Ok(new { Message = "Email sent successfully" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending email: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Error = $"Error sending email: {ex.Message}" });
            }
        }
    }
}
