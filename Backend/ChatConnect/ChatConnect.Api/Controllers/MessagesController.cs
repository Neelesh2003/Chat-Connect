using ChatConnect.Api.Models.MessageModels;
using ChatConnect.Application.Features.Messages.Commands.DeleteMessage;
using ChatConnect.Application.Features.Messages.Commands.SendMessage;
using ChatConnect.Application.Features.Messages.Queries.GetConversation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatConnect.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MessagesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var currentUserId = int.Parse(User.FindFirst("userId")!.Value);
            var command = new SendMessageCommand
            {
                SenderId = currentUserId,
                ReceiverId = request.ReceiverId,
                Content = request.Message,
                IsImage = false // Default; set based on content if needed
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("conversation/{userId}")]
        public async Task<IActionResult> GetConversation(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst("userId")!.Value);
            var query = new GetConversationQuery
            {
                UserId1 = currentUserId,
                UserId2 = userId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var currentUserId = int.Parse(User.FindFirst("userId")!.Value);
            var command = new DeleteMessageCommand
            {
                MessageId = id,
                UserId = currentUserId
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}