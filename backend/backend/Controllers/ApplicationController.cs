using backend.Records.Application;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("applications")]
    [ApiController]
    public class ApplicationController(ApplicationService service) : ControllerBase
    {
        private readonly ApplicationService _service = service;

        [HttpPost]
        [Authorize("Applications.Create")]
        public async Task<IActionResult> Create(CreateApplicationRequest request)
        {
            var newAppl = await _service.CreateApplicationAsync(request, User);

            return CreatedAtAction(nameof(Get), new {app_id = newAppl.Id}, newAppl);
        }

        [HttpGet("{app_id}")]
        [Authorize("Applications.Read")]
        public async Task<IActionResult> Get([FromRoute] Guid app_id)
        {
            try
            {
                var application = await _service.GetByIdAsync(app_id, User);
                return Ok(application);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Authorize("Applications.ReadAll")]
        public async Task<IActionResult> GetAll()
        {
            var apps = await _service.GetAllAsync(User);

            return Ok(apps);
        }

        [HttpPut]
        [Authorize("Applications.Assign")]
        public async Task<IActionResult> Assign(AssignApplicatonRequest request)
        {
            try
            {
                await _service.AssignAplicationAsync(request);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
