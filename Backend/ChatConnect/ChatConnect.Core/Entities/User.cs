using ChatConnect.Core.Common;
using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Core.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Username { get;  set; } = string.Empty;

        [Required]
        public string PasswordHash { get;  set; } = string.Empty;

        public bool IsOnline { get;  set; } = false;

        // Navigation properties
        public virtual ICollection<Message> SentMessages { get;  set; } = new List<Message>();
        public virtual ICollection<Message> ReceivedMessages { get;  set; } = new List<Message>();
        public virtual ICollection<GroupMember> GroupMemberships { get;  set; } = new List<GroupMember>();

        public User(string username, string passwordHash)
        {
            if (string.IsNullOrWhiteSpace(username) || username.Length < 3)
                throw new ArgumentException("Invalid username");
            Username = username;
            PasswordHash = passwordHash ?? throw new ArgumentNullException(nameof(passwordHash));
        }

        // Private constructor for EF
        public User() { }

        public void UpdateOnlineStatus(bool isOnline)
        {
            IsOnline = isOnline;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}