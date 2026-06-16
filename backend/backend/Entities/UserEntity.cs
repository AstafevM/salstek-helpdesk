using backend.Enums;

namespace backend.Entities
{
    // Пользователь (исполнитель, администратор, инициатор)
    public class UserEntity
    {
        public int Id { get; set; }

        public string Surname { get; set; } = String.Empty;

        public string Name { get; set; } = String.Empty;

        public string Patronymic { get; set; } = String.Empty;

        public string Email { get; set; } = String.Empty;

        public Role Role { get; set; }

        public bool IsDeleted { get; set; }

        public ICollection<ApplicationEntity> ClientApplications { get; set; } = [];

        public ICollection<ApplicationEntity> ResponsibleApplications { get; set; } = [];
    }
}
