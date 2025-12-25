using ChatConnect.Api.Models.GroupModels;
using ChatConnect.Api.Models.MessageModels;
using ChatConnect.Application.Features.Groups.Commands.AddMembersToGroup;
using ChatConnect.Application.Features.Groups.Commands.CreateGroup;
using ChatConnect.Application.Features.Groups.Commands.DeleteGroupMessage;
using ChatConnect.Application.Features.Groups.Commands.SendGroupMessage;
using ChatConnect.Application.Features.Groups.Queries.GetGroupMessages;
using ChatConnect.Application.Features.Groups.Queries.GetUserGroups; // ADD THIS
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatConnect.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GroupsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GroupsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ✅ ADD THIS MISSING ENDPOINT
        [HttpGet]
        public async Task<IActionResult> GetUserGroups()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var query = new GetUserGroupsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var command = new CreateGroupCommand
            {
                Name = request.Name,
                CreatedBy = currentUserId,
                MemberIds = request.Members ?? new List<int>()
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("{groupId}/members")]
        public async Task<IActionResult> AddMembers(int groupId, [FromBody] AddMembersRequest request)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var command = new AddMembersToGroupCommand
            {
                GroupId = groupId,
                AddedBy = currentUserId,
                MemberIds = request.Members
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("{groupId}/messages")]
        public async Task<IActionResult> SendGroupMessage(int groupId, [FromBody] SendGroupMessageRequest request)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var command = new SendGroupMessageCommand
            {
                GroupId = groupId,
                SenderId = currentUserId,
                Content = request.Message,
                IsImage = false
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("{groupId}/messages")]
        public async Task<IActionResult> GetGroupMessages(int groupId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = new GetGroupMessagesQuery
            {
                GroupId = groupId,
                UserId = currentUserId
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpDelete("{groupId}/messages/{messageId}")]
        public async Task<IActionResult> DeleteGroupMessage(int groupId, int messageId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var command = new DeleteGroupMessageCommand
            {
                MessageId = messageId,
                GroupId = groupId,
                UserId = currentUserId
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}