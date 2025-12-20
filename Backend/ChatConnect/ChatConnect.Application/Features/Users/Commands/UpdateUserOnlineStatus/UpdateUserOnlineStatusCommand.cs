using MediatR;

namespace ChatConnect.Application.Features.Users.Commands.UpdateUserOnlineStatus
{
    public class UpdateUserOnlineStatusCommand : IRequest
    {
        public int UserId { get; set; }
        public bool IsOnline { get; set; }
    }
}