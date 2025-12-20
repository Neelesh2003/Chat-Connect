using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommand : IRequest<MessageDto>
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsImage { get; set; }
    }
}