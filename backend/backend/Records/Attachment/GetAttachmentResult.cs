using backend.Entities;

namespace backend.Records.Attachment
{
    public record GetAttachmentResult(AttachmentEntity Attachment)
    {
        public Guid Id { get; init; } = Attachment.Id;
        public string OriginalFileName { get; init; } = Attachment.OriginalFileName;
        public string ServerFileName { get; init; } = Attachment.ServerFileName;
        public string FilePath { get; init; } = Attachment.FilePath;
        public long FileSize { get; init; } = Attachment.FileSize;
        public string ContentType { get; init; } = Attachment.ContentType;
        public Guid ApplicationId { get; init; } = Attachment.ApplicationId;
    }
}
