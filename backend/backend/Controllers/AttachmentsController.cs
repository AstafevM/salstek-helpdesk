using backend.Records.Attachment;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    public class AttachmentsController(AttachmentService service) : ControllerBase
    {
        private readonly AttachmentService _service = service;

        [HttpPost("applications/{app_id}/attachments")]
        public async Task<IActionResult> Create([FromRoute] Guid app_id, [FromForm] UploadAttachmentRequest req)
        {
            try
            {
                var newAttachment = await _service.CreateAttachmentAsync(app_id, req);
                return CreatedAtAction(nameof(Get), new {att_id = newAttachment.Id}, newAttachment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("attachments/{att_id}")]
        public async Task<IActionResult> Get([FromRoute] int att_id)
        {
            try
            {
                var attachment = await _service.GetByIdAsync(att_id);
                var stream = new FileStream(attachment.FilePath, FileMode.Open, FileAccess.Read);

                return File(stream, attachment.ContentType, attachment.OriginalFileName, true);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
