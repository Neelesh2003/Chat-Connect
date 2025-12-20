namespace ChatConnect.Core.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsImage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}