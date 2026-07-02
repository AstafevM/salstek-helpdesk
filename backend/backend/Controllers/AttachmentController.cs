using backend.Records.Attachment;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    public class AttachmentController(AttachmentService service) : ControllerBase
    {
        private readonly AttachmentService _service = service;

        [HttpPost("applications/{app_id}/attachments")]
        [Authorize("Attachments.Upload")]
        public async Task<IActionResult> Upload([FromRoute] Guid app_id, [FromForm] UploadAttachmentRequest req)
        {
            try
            {
                var newAttachment = await _service.UploadAttachmentAsync(app_id, req);
                return CreatedAtAction(nameof(Download), new {att_id = newAttachment.Id}, newAttachment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("attachments/{att_id}")]
        [Authorize("Attachments.Download")]
        public async Task<IActionResult> Download([FromRoute] Guid att_id)
        {
            try
            {
                var attachment = await _service.DownloadAttachmentAsync(att_id);
                var stream = new FileStream(attachment.FilePath, FileMode.Open, FileAccess.Read);

                return File(stream, attachment.ContentType, attachment.OriginalFileName, true);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("attachments/{att_id}")]
        [Authorize("Attachments.Delete")]
        public async Task<IActionResult> Delete([FromRoute] Guid att_id)
        {
            try
            {
                await _service.DeleteAttachmentAsync(att_id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
