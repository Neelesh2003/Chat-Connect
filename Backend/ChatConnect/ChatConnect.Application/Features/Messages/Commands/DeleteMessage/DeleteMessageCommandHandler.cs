using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Messages.Commands.DeleteMessage
{
    public class DeleteMessageCommandHandler : IRequestHandler<DeleteMessageCommand, bool>
    {
        private readonly IMessageRepository _messageRepository;

        public DeleteMessageCommandHandler(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository; 
        }

        public async Task<bool> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
        {
            var deleted = await _messageRepository.DeleteAsync(request.MessageId, request.UserId);
            if (deleted)
                await _messageRepository.SaveChangesAsync();
            return deleted;
        }
    }
}