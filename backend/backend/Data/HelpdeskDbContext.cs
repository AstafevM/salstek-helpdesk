using backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace backend.Data
{
    public class HelpdeskDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<UserEntity> Users { get; set; } = null!;

        public DbSet<ApplicationEntity> Applications { get; set; } = null!;

        public DbSet<AttachmentEntity> Attachments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
