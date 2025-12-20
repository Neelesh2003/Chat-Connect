using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, MessageDto>
    {
        private readonly IMessageRepository _messageRepository;

        public SendMessageCommandHandler(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var message = new Message
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                Content = request.Content,
                IsImage = request.IsImage,
                CreatedAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(message);
            await _messageRepository.SaveChangesAsync();

            return new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                IsImage = message.IsImage,
                CreatedAt = message.CreatedAt
            };
        }
    }
}