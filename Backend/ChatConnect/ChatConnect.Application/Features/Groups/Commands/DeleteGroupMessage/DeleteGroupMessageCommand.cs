using MediatR;

namespace ChatConnect.Application.Features.Groups.Commands.DeleteGroupMessage
{
    public class DeleteGroupMessageCommand : IRequest<bool>
    {
        public int MessageId { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
    }
}