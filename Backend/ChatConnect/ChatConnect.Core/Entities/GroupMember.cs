using ChatConnect.Core.Common;

namespace ChatConnect.Core.Entities
{
    public class GroupMember : BaseEntity
    {
        public int GroupId { get;  set; }
        public virtual Group Group { get;  set; } = null!;
        public int UserId { get;  set; }
        public virtual User User { get;  set; } = null!;
        public GroupMember() { }
    }
}