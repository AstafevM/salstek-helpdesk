using backend.Entities;
using backend.Enums;

namespace backend.Records.User
{
    public record GetUserResult(UserEntity User)
    {
        public Guid Id { get; init; } = User.Id;
        public string Surname { get; init; } = User.Surname;
        public string Name { get; init; } = User.Name;
        public string Patronymic { get; init; } = User.Patronymic;
        public string Email { get; init; } = User.Email;
        public Role Role { get; init; } = User.Role;
    }
}
