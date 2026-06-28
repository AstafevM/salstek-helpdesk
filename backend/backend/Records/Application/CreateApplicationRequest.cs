namespace backend.Records.Application
{
    public record CreateApplicationRequest(
        string Theme, 
        string Description,
        Guid ClientId);
}
