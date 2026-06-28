using backend.Enums;

namespace backend.Entities
{
    // Заявка
    public class ApplicationEntity(Guid id, DateTime createdAt, string theme, string description, Guid clientId)
    {
        public Guid Id { get; set; } = id;

        public DateTime CreatedAt { get; set; } = createdAt;

        public string Theme { get; set; } = theme;

        public string Description { get; set; } = description;

        public Guid ClientId { get; set; } = clientId;

        public UserEntity Client { get; set; } = null!;

        public Status ApplicationStatus { get; set; } = Status.New;

        public Priority ApplicationPriority { get; set; } = Priority.NotSet;

        public Guid? ResponsibleId { get; set; }

        public UserEntity? Responsible { get; set; }

        public ICollection<AttachmentEntity> Attachments { get; set; } = [];
    }
}
