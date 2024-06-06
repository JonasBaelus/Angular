using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TripPlanner.API;
using TripPlannerAPI.Data;

var corsConfig = "_corsConfig";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAutoMapper(typeof(Program));

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var auth0Config = builder.Configuration.GetSection("Auth0").Get<Auth0Config>();

if (builder.Environment.IsProduction())
{
    // Use production connection string
    connectionString = builder.Configuration.GetConnectionString("ProductionConnection");

}
/*
if (builder.Environment.IsProduction())
{
    // Use production Audience
    auth0Config = builder.Configuration.GetSection("Auth0Production").Get<Auth0Config>();

}*/

builder.Services.AddDbContext<TripContext>(options =>
options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsConfig,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "https://trip-planner-46730.web.app")
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddSqlServer<TripContext>(connectionString, options => options.EnableRetryOnFailure());

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
            .AddJwtBearer(options =>
            {
                options.Authority = $"https://{auth0Config.Domain}/";
                if (builder.Environment.IsDevelopment())
                {
                    options.Audience = "https://localhost:7113";
                }
                else
                {
                    options.Audience = "https://tripplanner-api-eliasgrinwis.cloud.okteto.net";
                }

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier,
                    RoleClaimType = ClaimTypes.Role,
                };
            });

builder.Services.AddAuthorization(options =>
{
    //We create different policies where each policy contains the permissions required to fulfill them
    options.AddPolicy("DeleteAccess", policy =>
                          policy.RequireClaim("permissions", "delete:trip"));
    options.AddPolicy("GetAccess", policy =>
                        policy.RequireClaim("permissions", "getall:trips"));
});

builder.Services.AddControllers();

builder.Services.AddSwaggerService();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsConfig);

using (var scope = app.Services.CreateScope())
{
    var myContext = scope.ServiceProvider.GetRequiredService<TripContext>();
    DBInitializer.Initialize(myContext);
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();