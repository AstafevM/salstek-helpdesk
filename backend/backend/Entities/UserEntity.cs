using backend.Enums;

namespace backend.Entities
{
    // Пользователь (исполнитель, администратор, инициатор)
    public class UserEntity(Guid id, string surname, string name, string patronymic, string email, string passwordHash, Role role)
    {
        public Guid Id { get; set; } = id;

        public string Surname { get; set; } = surname;

        public string Name { get; set; } = name;

        public string Patronymic { get; set; } = patronymic;

        public string Email { get; set; } = email;

        public string PasswordHash { get; set; } = passwordHash;

        public Role Role { get; set; } = role;

        public bool IsDeleted { get; set; }

        public ICollection<ApplicationEntity> ClientApplications { get; set; } = [];

        public ICollection<ApplicationEntity> ResponsibleApplications { get; set; } = [];
    }
}
