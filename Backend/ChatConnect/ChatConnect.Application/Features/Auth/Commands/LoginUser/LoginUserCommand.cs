using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Auth.Commands.LoginUser
{
    public class LoginUserCommand : IRequest<AuthResultDto?>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}