using backend.Data;
using backend.Entities;
using backend.Other;
using backend.Records.User;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService(
        HelpdeskDbContext context,
        PasswordHasher passwordHasher,
        JwtProvider jwtProvider)
    {
        private readonly HelpdeskDbContext _context = context;
        private readonly PasswordHasher _passwordHasher = passwordHasher;
        private readonly JwtProvider _jwtProvider = jwtProvider;

        public async Task<GetUserResult> RegisterAsync(RegisterUserRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Ошибка регистрации: пользователь уже существует.");

            var newUser = new UserEntity(
                Guid.NewGuid(), 
                request.Surname,
                request.Name, 
                request.Patronymic,
                request.Email,
                _passwordHasher.Generate(request.Password),
                request.Role);

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return new GetUserResult(newUser);
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user =
                await _context.Users.FirstOrDefaultAsync(u => u.Email == email) ??
                throw new Exception("Ошибка входа: неверный email или пароль.");

            var result = _passwordHasher.Verify(password, user.PasswordHash);

            if (!result)
                throw new Exception("Ошибка входа: неверный email или пароль.");

            var token = _jwtProvider.GenerateToken(user);

            return token;
        }

        public async Task<GetUserResult>GetByIdAsync(Guid userId)
        {
            var user = 
                await _context.Users.FindAsync(userId) ??
                throw new Exception($"Пользователь {userId} не найден в БД.");

            return new GetUserResult(user);
        }

        public async Task<List<GetUserResult>> GetAllAsync()
        {
            var users = await _context.Users
                .AsNoTracking()
                .Where(u => !u.IsDeleted)
                .Select(u => new GetUserResult(u))
                .ToListAsync();

            return users;
        }

        public async Task DeleteAsync(Guid user_id)
        {
            var user = 
                await _context.Users.FindAsync(user_id) ??
                throw new Exception($"Пользователь {user_id} не найден в БД");

            user.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
