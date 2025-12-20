namespace ChatConnect.Core.DTOs
{
    public class GroupMessageDto
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsImage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}