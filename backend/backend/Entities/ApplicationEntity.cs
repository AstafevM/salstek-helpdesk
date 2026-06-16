using backend.Enums;

namespace backend.Entities
{
    // Заявка
    public class ApplicationEntity
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Theme { get; set; } = String.Empty;

        public string Description { get; set; } = String.Empty;

        public int? ClientId { get; set; }

        public UserEntity Client { get; set; } = null!;

        public Status ApplicationStatus { get; set; }

        public Priority ApplicationPriority { get; set; }

        public int? ResponsibleId { get; set; }

        public UserEntity Responsible { get; set; } = null!;

        public ICollection<AttachmentEntity> Attachments { get; set; } = [];
    }
}
