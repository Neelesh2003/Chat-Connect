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
        public string Content { get;  set; } = string.Empty;
        public bool IsImage { get;  set; } = false;
        public GroupMessage() { }
    }
}