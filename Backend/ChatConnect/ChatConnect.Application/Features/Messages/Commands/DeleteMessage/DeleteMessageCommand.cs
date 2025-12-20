using MediatR;

namespace ChatConnect.Application.Features.Messages.Commands.DeleteMessage
{
    public class DeleteMessageCommand : IRequest<bool>
    {
        public int MessageId { get; set; }
        public int UserId { get; set; }
    }
}