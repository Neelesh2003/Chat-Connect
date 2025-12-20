using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Users.Commands.UpdateUserOnlineStatus
{
    public class UpdateUserOnlineStatusCommandHandler : IRequestHandler<UpdateUserOnlineStatusCommand>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserOnlineStatusCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task Handle(UpdateUserOnlineStatusCommand request, CancellationToken cancellationToken)
        {
            await _userRepository.UpdateOnlineStatusAsync(request.UserId, request.IsOnline);
            await _userRepository.SaveChangesAsync();
        }
    }
}