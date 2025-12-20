using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;

namespace ChatConnect.Core.Interfaces.Repositories
{
    public interface IGroupRepository
    {
        Task AddAsync(Group group);
        Task<bool> AddMemberAsync(int groupId, int userId);
        Task<bool> IsMemberAsync(int groupId, int userId);
        Task<List<GroupMemberDto>> GetGroupMembersAsync(int groupId);
        Task SaveChangesAsync();
    }
}