using ChatConnect.Core.Common;
using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Core.Entities
{
    public class Message : BaseEntity
    {
        public int SenderId { get;  set; }
        public virtual User Sender { get;  set; } = null!;

        public int ReceiverId { get;  set; }
        public virtual User Receiver { get;  set; } = null!;

        [Required]
        [MaxLength(5000)]
        public string Content { get;  set; } = string.Empty;

        public bool IsImage { get;  set; } = false;

        public Message(int senderId, int receiverId, string content, bool isImage = false)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content is required");
            SenderId = senderId;
            ReceiverId = receiverId;
            Content = content;
            IsImage = isImage;
        }

        // Private constructor for EF
        public Message() { }
    }
}