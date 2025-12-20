namespace ChatConnect.Core.DTOs
{
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<int> MemberIds { get; set; } = new();
    }
}