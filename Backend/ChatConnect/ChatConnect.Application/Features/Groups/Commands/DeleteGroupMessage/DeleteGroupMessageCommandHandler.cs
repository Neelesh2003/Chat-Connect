using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.DeleteGroupMessage
{
    public class DeleteGroupMessageCommandHandler : IRequestHandler<DeleteGroupMessageCommand, bool>
    {
        private readonly IGroupMessageRepository _groupMessageRepository;

        public DeleteGroupMessageCommandHandler(IGroupMessageRepository groupMessageRepository)
        {
            _groupMessageRepository = groupMessageRepository;
        }
        public async Task<bool> Handle(DeleteGroupMessageCommand request, CancellationToken cancellationToken)
        {
            var deleted = await _groupMessageRepository.DeleteAsync(request.MessageId, request.UserId);
            if (deleted)
                await _groupMessageRepository.SaveChangesAsync();
            return deleted;
        }
    }
}