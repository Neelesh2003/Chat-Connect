using ChatConnect.Core.Common;
using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Core.Entities
{
    public class GroupMessage : BaseEntity
    {
        public int GroupId { get;  set; }
        public virtual Group Group { get;  set; } = null!;

        public int SenderId { get;  set; }
        public virtual User Sender { get;  set; } = null!;

        [Required]
        [MaxLength(5000)]
        public string Content { get;  set; } = string.Empty;

        public bool IsImage { get;  set; } = false;

        public GroupMessage(int groupId, int senderId, string content, bool isImage = false)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content is required");
            GroupId = groupId;
            SenderId = senderId;
            Content = content;
            IsImage = isImage;
        }

        // Private constructor for EF
        public GroupMessage() { }
    }
}