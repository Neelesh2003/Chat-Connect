using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Auth.Queries.GetUsers
{
    public class GetUsersQuery : IRequest<List<UserDto>>
    {
    }
}