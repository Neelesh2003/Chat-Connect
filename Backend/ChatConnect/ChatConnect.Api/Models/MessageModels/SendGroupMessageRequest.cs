namespace ChatConnect.Api.Models.MessageModels
{
    public class SendGroupMessageRequest
    {
        public string Message { get; set; } = string.Empty;
        public bool IsImage { get; set; } = false;
    }
}