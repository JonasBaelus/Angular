using Microsoft.EntityFrameworkCore;
using TripPlanner.DAL.Models;

namespace TripPlannerAPI.Data
{
    public class TripContext : DbContext
    {
        public TripContext()
        {
        }



        public TripContext(DbContextOptions<TripContext> options) : base(options)
        { }
        // public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripActivity> TripActivities { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<UserTrip> UserTrips { get; set; }
        public DbSet<TripKeyword> TripKeywords { get; set; }
        public DbSet<TripCategory> TripCategories { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Trip>().ToTable("Trip");
            modelBuilder.Entity<TripActivity>().ToTable("TripActivity");
            modelBuilder.Entity<Activity>().ToTable("Activity");
            modelBuilder.Entity<Keyword>().ToTable("Keyword");
            modelBuilder.Entity<Category>().ToTable("Category");
            modelBuilder.Entity<UserTrip>().ToTable("UserTrip");
            modelBuilder.Entity<TripKeyword>().ToTable("TripKeyword");
            modelBuilder.Entity<TripCategory>().ToTable("TripCategory");

            modelBuilder.Entity<Activity>()
                .HasMany(a => a.TripActivities)
                .WithOne(a => a.Activity) 
                .HasForeignKey(a => a.ActivityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TripActivity>()
                .HasKey(ta => ta.TripActivityId);

            modelBuilder.Entity<TripActivity>()
                .HasOne(ta => ta.Trip)
                .WithMany(t => t.TripActivities)
                .HasForeignKey(ta => ta.TripId);

            modelBuilder.Entity<TripActivity>()
                .HasOne(ta => ta.Activity)
                .WithMany(a => a.TripActivities)
                .HasForeignKey(ta => ta.ActivityId);


            modelBuilder.Entity<UserTrip>()
                .HasKey(ut => new { ut.UserId, ut.TripId });
            modelBuilder.Entity<UserTrip>()
                .HasOne(ut => ut.Trip)
                .WithMany(u => u.Users)
                .HasForeignKey(ut => ut.TripId);

            modelBuilder.Entity<TripCategory>()
                .HasKey(tc => new { tc.TripId, tc.CategoryId });
            modelBuilder.Entity<TripCategory>()
                .HasOne(tc => tc.Trip)
                .WithMany(t => t.TripCategories)
                .HasForeignKey(tc => tc.TripId);
            modelBuilder.Entity<TripCategory>()
                .HasOne(tc => tc.Category)
                .WithMany(c => c.TripCategories)
                .HasForeignKey(tc => tc.CategoryId);

            modelBuilder.Entity<TripKeyword>()
                .HasKey(tc => new { tc.TripId, tc.KeywordId });
            modelBuilder.Entity<TripKeyword>()
                .HasOne(tc => tc.Trip)
                .WithMany(t => t.TripKeywords)
                .HasForeignKey(tc => tc.TripId);
            modelBuilder.Entity<TripKeyword>()
                .HasOne(tc => tc.Keyword)
                .WithMany(c => c.TripKeywords)
                .HasForeignKey(tc => tc.KeywordId);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=TripPlannerAPI;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }
    }
}