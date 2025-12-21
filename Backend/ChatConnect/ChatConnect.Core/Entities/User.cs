using ChatConnect.Core.Common;
using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Core.Entities
{
    public class User : BaseEntity
    {
        public string Username { get;  set; } = string.Empty;
        public string PasswordHash { get;  set; } = string.Empty;
        public bool IsOnline { get;  set; } = false;

        // Navigation properties
        public virtual ICollection<Message> SentMessages { get;  set; } = new List<Message>();
        public virtual ICollection<Message> ReceivedMessages { get;  set; } = new List<Message>();
        public virtual ICollection<GroupMember> GroupMemberships { get;  set; } = new List<GroupMember>();
        public User() { }
        public void UpdateOnlineStatus(bool isOnline)
        {
            IsOnline = isOnline;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}