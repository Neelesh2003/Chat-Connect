using ChatConnect.Core.DTOs;
using ChatConnect.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Identity;
using ChatConnect.Core.Interfaces.Services;
using MediatR;
using ChatConnect.Core.Entities;

namespace ChatConnect.Application.Features.Auth.Commands.LoginUser
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthResultDto?>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public LoginUserCommandHandler(IUserRepository userRepository, IJwtService jwtService, IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResultDto?> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user == null ||_passwordHasher.VerifyHashedPassword(user, user.PasswordHash,request.Password) != PasswordVerificationResult.Success)
            {
                return null;
            }

            var token = _jwtService.GenerateToken(user);
            return new AuthResultDto { Token = token, User = new UserDto { Id = user.Id, Username = user.Username } };
        }
    }
}