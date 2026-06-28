using backend.Records.User;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("users")]
    [ApiController]
    public class UsersController(UserService service) : ControllerBase
    {
        private readonly UserService _service = service;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserRequest request)
        {
            try
            {
                var newUser = await _service.RegisterAsync(request);

                return CreatedAtAction(nameof(GetById), new { user_id = newUser.Id }, newUser);
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserRequest request)
        {
            try
            {
                var token = await _service.LoginAsync(request.Email, request.Password);

                HttpContext.Response.Cookies.Append("tokies", token);

                return NoContent();
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("{user_id}")]
        public async Task<IActionResult> GetById([FromRoute] int user_id)
        {
            try
            {
                var user = await _service.GetByIdAsync(user_id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        [HttpDelete("{user_id}")]
        public async Task<IActionResult> Delete([FromRoute] int user_id)
        {
            try
            {
                await _service.DeleteAsync(user_id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
