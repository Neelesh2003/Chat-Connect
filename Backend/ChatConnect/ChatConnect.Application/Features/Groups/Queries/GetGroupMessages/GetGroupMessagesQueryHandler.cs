using ChatConnect.Core.DTOs;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Queries.GetGroupMessages
{
    public class GetGroupMessagesQueryHandler : IRequestHandler<GetGroupMessagesQuery, List<GroupMessageDto>>
    {
        private readonly IGroupMessageRepository _groupMessageRepository;
        private readonly IGroupRepository _groupRepository;

        public GetGroupMessagesQueryHandler(IGroupMessageRepository groupMessageRepository, IGroupRepository groupRepository)
        {
            _groupMessageRepository = groupMessageRepository;
            _groupRepository = groupRepository;
        }

        public async Task<List<GroupMessageDto>> Handle(GetGroupMessagesQuery request, CancellationToken cancellationToken)
        {
            // Check membership
            var isMember = await _groupRepository.IsMemberAsync(request.GroupId, request.UserId);
            if (!isMember)
                throw new UnauthorizedAccessException("Not a group member");

            var messages = await _groupMessageRepository.GetByGroupAsync(request.GroupId);
            return messages;
        }
    }
}