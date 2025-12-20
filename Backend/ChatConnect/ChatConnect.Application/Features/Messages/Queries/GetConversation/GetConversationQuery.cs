using ChatConnect.Core.DTOs;
using MediatR;

namespace ChatConnect.Application.Features.Messages.Queries.GetConversation
{
    public class GetConversationQuery : IRequest<List<MessageDto>>
    {
        public int UserId1 { get; set; }
        public int UserId2 { get; set; }
    }
}