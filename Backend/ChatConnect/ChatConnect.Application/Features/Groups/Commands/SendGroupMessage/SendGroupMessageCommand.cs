using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.SendGroupMessage
{
    public class SendGroupMessageCommand : IRequest<GroupMessageDto>
    {
        public int GroupId { get; set; }
        public int SenderId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsImage { get; set; }
    }
}