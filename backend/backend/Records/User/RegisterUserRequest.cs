using backend.Enums;

namespace backend.Records.User
{
    public record RegisterUserRequest(
        string Surname, 
        string Name, 
        string Patronymic, 
        string Email,
        string Password,
        Role Role);
}
