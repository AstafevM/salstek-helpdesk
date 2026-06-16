namespace backend.Entities
{
    // Вложение
    public class AttachmentEntity
    {
        public int Id { get; set; }

        public string ServerFileName { get; set; } = String.Empty;
        
        public string OriginalFileName { get; set; } = String.Empty;
        
        public string FilePath { get; set; } = String.Empty;
        
        public long FileSize { get; set; }
        
        public string ContentType { get; set; } = String.Empty; // Например, "image/png"

        public int ApplicationId { get; set; }

        public ApplicationEntity Application { get; set; } = null!;
    }
}
