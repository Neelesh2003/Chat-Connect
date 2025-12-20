using ChatConnect.Core.DTOs;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Messages.Queries.GetConversation
{
    public class GetConversationQueryHandler : IRequestHandler<GetConversationQuery, List<MessageDto>>
    {
        private readonly IMessageRepository _messageRepository;

        public GetConversationQueryHandler(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task<List<MessageDto>> Handle(GetConversationQuery request, CancellationToken cancellationToken)
        {
            var messages = await _messageRepository.GetConversationAsync(request.UserId1, request.UserId2);
            return messages;
        }
    }
}