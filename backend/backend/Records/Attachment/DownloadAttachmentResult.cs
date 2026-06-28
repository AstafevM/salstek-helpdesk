namespace backend.Records.Attachment
{
    public record DownloadAttachmentResult(
        string OriginalFileName,
        string FilePath,
        string ContentType);
}
