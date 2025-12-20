using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Queries.GetGroupMessages
{
    public class GetGroupMessagesQuery : IRequest<List<GroupMessageDto>>
    {
        public int GroupId { get; set; }
        public int UserId { get; set; }
    }
}