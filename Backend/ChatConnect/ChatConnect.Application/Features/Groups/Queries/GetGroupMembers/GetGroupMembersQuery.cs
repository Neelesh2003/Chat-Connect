using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Queries.GetGroupMembers
{
   public class GetGroupMembersQuery : IRequest<List<GroupMemberDto>>
    {
        public int GroupId { get; set; } 
    }
}
