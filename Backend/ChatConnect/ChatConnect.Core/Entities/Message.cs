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
        public string Content { get;  set; } = string.Empty;
        public bool IsImage { get;  set; } = false;
        public Message() { }
    }
}