using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.AddMembersToGroup
{
    public class AddMembersToGroupCommand : IRequest<bool>
    {
        public int GroupId { get; set; }
        public int AddedBy { get; set; }
        public List<int> MemberIds { get; set; } = new();
    }
}