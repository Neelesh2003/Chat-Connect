using ChatConnect.Application.Features.Groups.Queries.GetGroupMembers;
using ChatConnect.Application.Features.Users.Commands.UpdateUserOnlineStatus;
using ChatConnect.Core.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatConnect.Api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = int.Parse(Context.User!.FindFirst("userId")!.Value);
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            await _mediator.Send(new UpdateUserOnlineStatusCommand { UserId = userId, IsOnline = true });
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = int.Parse(Context.User!.FindFirst("userId")!.Value);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            await _mediator.Send(new UpdateUserOnlineStatusCommand { UserId = userId, IsOnline = false });
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(MessageDto message)
        {
            var receiverConnectionId = await GetConnectionId(message.ReceiverId);
            if (!string.IsNullOrEmpty(receiverConnectionId))
            {
                await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", message);
            }
            await Clients.Group($"user_{message.ReceiverId}").SendAsync("ReceiveMessage", message);
        }

        public async Task SendGroupMessage(GroupMessageDto message)
        {
            // Notify all group members
            var groupMembers = await _mediator.Send(new GetGroupMembersQuery { GroupId = message.GroupId });
            foreach (var memberId in groupMembers.Select(m => m.UserId))
            {
                var connectionId = await GetConnectionId(memberId);
                if (!string.IsNullOrEmpty(connectionId))
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveGroupMessage", message);
                }
            }
        }

        private async Task<string?> GetConnectionId(int userId)
        {
            // Logic to map user to connection ID (can use a service or cache)
            // For simplicity, assume a service is injected
            return null; // Placeholder - implement with online user tracking
        }
    }
}