using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.AddMembersToGroup
{
    public class AddMembersToGroupCommandHandler : IRequestHandler<AddMembersToGroupCommand, bool>
    {
        private readonly IGroupRepository _groupRepository;

        public AddMembersToGroupCommandHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<bool> Handle(AddMembersToGroupCommand request, CancellationToken cancellationToken)
        {
            var success = true;
            foreach (var memberId in request.MemberIds)
            {
                success &= await _groupRepository.AddMemberAsync(request.GroupId, memberId);
            }
            if (success)
                await _groupRepository.SaveChangesAsync();
            return success;
        }
    }
}