using backend.Records.Application;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("applications")]
    [ApiController]
    [Authorize]
    public class ApplicationsController(ApplicationService service) : ControllerBase
    {
        private readonly ApplicationService _service = service;

        [HttpPost]
        public async Task<IActionResult> Create(CreateApplicationRequest request)
        {
            var newAppl = await _service.CreateApplicationAsync(request);

            return CreatedAtAction(nameof(Get), new {app_id = newAppl.Id}, newAppl);
        }

        [HttpGet("{app_id}")]
        public async Task<IActionResult> Get([FromRoute] int app_id)
        {
            try
            {
                var application = await _service.GetByIdAsync(app_id);
                return Ok(application);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var apps = await _service.GetAllAsync();
            return Ok(apps);
        }
    }
}
