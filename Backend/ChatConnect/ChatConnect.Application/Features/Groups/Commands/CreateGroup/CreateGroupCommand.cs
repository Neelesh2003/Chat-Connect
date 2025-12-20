using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.CreateGroup
{
    public class CreateGroupCommand : IRequest<GroupDto>
    {
        public string Name { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public List<int> MemberIds { get; set; } = new();
    }
}