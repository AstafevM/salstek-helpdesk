using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(u => u.Id);

            builder
                .HasMany(u => u.ClientApplications)
                .WithOne(app => app.Client)
                .HasForeignKey(app => app.ClientId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasMany(u => u.ResponsibleApplications)
                .WithOne(app => app.Responsible)
                .HasForeignKey(app => app.ResponsibleId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
