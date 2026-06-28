namespace backend.Entities
{
    // Вложение
    public class AttachmentEntity(Guid id, string originalFileName, string serverFileName, string filePath, long fileSize, string contentType, Guid applicationId)
    {
        public Guid Id { get; set; } = id;

        public string OriginalFileName { get; set; } = originalFileName;

        public string ServerFileName { get; set; } = serverFileName;

        public string FilePath { get; set; } = filePath;

        public long FileSize { get; set; } = fileSize;

        public string ContentType { get; set; } = contentType;

        public Guid ApplicationId { get; set; } = applicationId;

        public ApplicationEntity Application { get; set; } = null!;
    }
}
