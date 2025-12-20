using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.SendGroupMessage
{
    public class SendGroupMessageCommandHandler : IRequestHandler<SendGroupMessageCommand, GroupMessageDto>
    {
        private readonly IGroupMessageRepository _groupMessageRepository;

        public SendGroupMessageCommandHandler(IGroupMessageRepository groupMessageRepository)
        {
            _groupMessageRepository = groupMessageRepository;
        }

        public async Task<GroupMessageDto> Handle(SendGroupMessageCommand request, CancellationToken cancellationToken)
        {
            var message = new GroupMessage
            {
                GroupId = request.GroupId,
                SenderId = request.SenderId,
                Content = request.Content,
                IsImage = request.IsImage,
                CreatedAt = DateTime.UtcNow
            };

            await _groupMessageRepository.AddAsync(message);
            await _groupMessageRepository.SaveChangesAsync();

            return new GroupMessageDto
            {
                Id = message.Id,
                GroupId = message.GroupId,
                SenderId = message.SenderId,
                Content = message.Content,
                IsImage = message.IsImage,
                CreatedAt = message.CreatedAt
            };
        }
    }
}