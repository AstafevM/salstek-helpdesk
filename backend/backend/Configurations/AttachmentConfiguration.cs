using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configurations
{
    public class AttachmentConfiguration : IEntityTypeConfiguration<AttachmentEntity>
    {
        public void Configure(EntityTypeBuilder<AttachmentEntity> builder)
        {
            builder.HasKey(att => att.Id);

            builder
                .HasOne(att => att.Application)
                .WithMany(app => app.Attachments);

            //builder
            //    .Property(att => att.ServerFileName)
            //    .HasComputedColumnSql("[Id] + '_' + [OriginalFileName]");
        }
    }
}
