using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;

namespace ChatConnect.Core.Interfaces.Repositories
{
    public interface IGroupMessageRepository
    {
        Task AddAsync(GroupMessage message);
        Task<List<GroupMessageDto>> GetByGroupAsync(int groupId);
        Task<bool> DeleteAsync(int messageId, int userId);
        Task SaveChangesAsync();
    }
}