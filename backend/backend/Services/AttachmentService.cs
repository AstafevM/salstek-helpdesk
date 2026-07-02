using backend.Data;
using backend.Entities;
using backend.Records.Attachment;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AttachmentService(HelpdeskDbContext context)
    {
        private readonly HelpdeskDbContext _context = context;

        public async Task<GetAttachmentResult> UploadAttachmentAsync(Guid applicationId, UploadAttachmentRequest request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                throw new FileNotFoundException("Прикреплённый файл пустой или не существует.");
            }

            var fileSavePath = Path.Combine(AppContext.BaseDirectory, $"uploads/{applicationId}");

            if (!Directory.Exists(fileSavePath))
            {
                Directory.CreateDirectory(fileSavePath);
            }

            var attachmentGuid = Guid.NewGuid();
            var serverFileName = $"{attachmentGuid}.{request.File.FileName.Split(".")[^1]}";
            var fullPath = Path.Combine(fileSavePath, serverFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var newAttachment = new AttachmentEntity(
                attachmentGuid,
                request.File.FileName,
                serverFileName,
                fullPath,
                request.File.Length,
                request.File.ContentType,
                applicationId);

            await _context.Attachments.AddAsync(newAttachment);
            await _context.SaveChangesAsync();

            return new GetAttachmentResult(newAttachment);
        }

        public async Task<DownloadAttachmentResult> DownloadAttachmentAsync(Guid attId)
        {
            var attachment =
                await _context.Attachments.FindAsync(attId) ??
                throw new Exception($"Вложение {attId} не найдено в БД.");

            if (!File.Exists(attachment.FilePath))
            {
                throw new FileNotFoundException($"Вложение {attId} не найдено на диске.");
            }

            return new DownloadAttachmentResult(
                attachment.OriginalFileName,
                attachment.FilePath, 
                attachment.ContentType);
        }

        public async Task DeleteAttachmentAsync(Guid id)
        {
            var attachment = 
                await _context.Attachments.FindAsync(id) ?? 
                throw new Exception($"Вложение {id} не найдено в БД.");

            _context.Attachments.Remove(attachment);
            await _context.SaveChangesAsync();

            if (File.Exists(attachment.FilePath))
            {
                File.Delete(attachment.FilePath);
            }
            else
            {
                throw new Exception($"Файл по пути {attachment.FilePath} не найден.");
            }
        }
    }
}
