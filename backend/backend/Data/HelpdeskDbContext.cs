using backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace backend.Data
{
    public class HelpdeskDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<UserEntity> Users => Set<UserEntity>();

        public DbSet<ApplicationEntity> Applications => Set<ApplicationEntity>();

        public DbSet<AttachmentEntity> Attachments => Set<AttachmentEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
