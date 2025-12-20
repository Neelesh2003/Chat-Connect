using ChatConnect.Application.Features.Groups.Queries.GetGroupMembers;
using ChatConnect.Application.Features.Groups.Queries.GetGroupMessages;
using ChatConnect.Core.DTOs;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Auth.Commands.RegisterUser
{
    class GetGroupMembersQueryHandler : IRequestHandler<GetGroupMembersQuery, List<GroupMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;
        public GetGroupMembersQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }
        public async Task<List<GroupMemberDto>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
        {
          return await _groupRepository.GetGroupMembersAsync(request.GroupId);
           
        }
    }
}
