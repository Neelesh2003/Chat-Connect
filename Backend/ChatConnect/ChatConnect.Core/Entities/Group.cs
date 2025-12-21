using ChatConnect.Core.Common;
using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Core.Entities
{
    public class Group : BaseEntity
    {
        public string Name { get;  set; } = string.Empty;
        public int CreatedBy { get;  set; }
        public virtual User CreatedByUser { get;  set; } = null!;

        // Navigation properties
        public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
        public virtual ICollection<GroupMessage> Messages { get;  set; } = new List<GroupMessage>();
        public Group() { }
    }
}