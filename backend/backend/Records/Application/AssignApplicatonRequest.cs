namespace backend.Records.Application
{
    public record AssignApplicatonRequest(Guid ApplicationId, Guid NewResponsibleId);
}
