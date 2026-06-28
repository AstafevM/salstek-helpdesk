using backend.Data;
using backend.Entities;
using backend.Records.Application;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ApplicationService(HelpdeskDbContext context)
    {
        private readonly HelpdeskDbContext _context = context;

        public async Task<GetApplicationResult> CreateApplicationAsync(CreateApplicationRequest request)
        {
            var newApplication = new ApplicationEntity(
                Guid.NewGuid(),
                DateTime.Now,
                request.Theme,
                request.Description,
                request.ClientId);

            await _context.Applications.AddAsync(newApplication);
            await _context.SaveChangesAsync();

            return new GetApplicationResult(newApplication);
        }

        public async Task<GetApplicationResult> GetByIdAsync(int appId)
        {
            var appl =
                await _context.Applications.FindAsync(appId) ??
                throw new Exception($"Заявка {appId} не найдена в БД.");

            return new GetApplicationResult(appl);
        }

        public async Task<List<GetApplicationResult>> GetAllAsync()
        {
            var apps = await _context.Applications
                .AsNoTracking()
                .Select(app => new GetApplicationResult(app))
                .ToListAsync();

            return apps;
        }
    }
}
