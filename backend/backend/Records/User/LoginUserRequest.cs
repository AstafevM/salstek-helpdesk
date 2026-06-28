namespace backend.Records.User
{
    public record LoginUserRequest(
        string Email,
        string Password);
}
