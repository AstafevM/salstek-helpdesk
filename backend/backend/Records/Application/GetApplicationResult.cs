using backend.Entities;
using backend.Enums;

namespace backend.Records.Application
{
    public record GetApplicationResult(ApplicationEntity Application)
    {
        public Guid Id { get; init; } = Application.Id;
        public DateTime CreatedAt { get; init; } = Application.CreatedAt;
        public string Theme { get; init; } = Application.Theme;
        public string Description { get; init; } = Application.Description;
        public Guid ClientId { get; init; } = Application.ClientId;
        public Guid? ResponsibleId { get; init; } = Application.ResponsibleId;
        public Status ApplicationStatus { get; init; } = Application.ApplicationStatus;
        public Priority ApplicationPriority { get; init; } = Application.ApplicationPriority;
    }
}
