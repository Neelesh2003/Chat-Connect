using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Api.Models.MessageModels
{
    public class SendMessageRequest
    {
        [Required]
        public int ReceiverId { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        public bool IsImage { get; set; } = false; // For image support
    }
}