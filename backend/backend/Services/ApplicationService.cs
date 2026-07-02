using backend.Data;
using backend.Entities;
using backend.Enums;
using backend.Records.Application;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace backend.Services
{
    public class ApplicationService(HelpdeskDbContext context)
    {
        private readonly HelpdeskDbContext _context = context;

        public async Task<GetApplicationResult> CreateApplicationAsync(CreateApplicationRequest request, ClaimsPrincipal user)
        {
            var newApplication = new ApplicationEntity(
                Guid.NewGuid(),
                DateTime.Now,
                request.Theme,
                request.Description,
                Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!));

            await _context.Applications.AddAsync(newApplication);
            await _context.SaveChangesAsync();

            return new GetApplicationResult(newApplication);
        }

        public async Task<GetApplicationResult> GetByIdAsync(Guid appId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = Enum.Parse<Role>(user.FindFirstValue(ClaimTypes.Role)!);

            var appl =
                await _context.Applications.FindAsync(appId) ??
                throw new Exception($"Заявка {appId} не найдена в БД.");

            switch (userRole)
            {
                case Role.Admin:
                    return new GetApplicationResult(appl);

                case Role.Executor:
                    if (appl.ApplicationStatus == Status.New || appl.ResponsibleId == userId)
                        return new GetApplicationResult(appl);
                    else
                        throw new Exception("Доступ запрещён.");

                case Role.Client:
                    if (appl.ClientId ==  userId)
                        return new GetApplicationResult(appl);
                    else
                        throw new Exception("Доступ запрещён.");

                default:
                    throw new SwitchExpressionException("Невалидная роль.");
            }
        }

        public async Task<List<GetApplicationResult>> GetAllAsync(ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = Enum.Parse<Role>(user.FindFirstValue(ClaimTypes.Role)!);

            var apps = _context.Applications.AsNoTracking();

            return userRole switch
            {
                Role.Admin => await apps
                                        .Select(app => new GetApplicationResult(app))
                                        .ToListAsync(),

                Role.Executor => await apps
                                        .Where(app => app.ResponsibleId == userId || app.ApplicationStatus == Status.New)
                                        .Select(app => new GetApplicationResult(app))
                                        .ToListAsync(),

                Role.Client => await apps
                                        .Where(app => app.ClientId == userId)
                                        .Select(app => new GetApplicationResult(app))
                                        .ToListAsync(),

                _ => throw new SwitchExpressionException("Невалидная роль."),
            };
        }

        public async Task AssignAplicationAsync(AssignApplicatonRequest request)
        {
            var appl = 
                await _context.Applications.FindAsync(request.ApplicationId) ??
                throw new Exception($"Заявка {request.ApplicationId} не найдена в БД.");

            appl.ResponsibleId = request.NewResponsibleId;

            await _context.SaveChangesAsync();
        }
    }
}
