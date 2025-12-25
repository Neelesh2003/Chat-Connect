using MediatR;

namespace ChatConnect.Application.Features.Groups.Queries.GetUserGroups
{
    public class GetUserGroupsQuery : IRequest<List<GroupDto>>
    {
    }
}