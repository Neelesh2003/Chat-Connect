using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;

namespace ChatConnect.Core.Interfaces.Repositories
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message);
        Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2);
        Task<bool> DeleteAsync(int messageId, int userId);
        Task SaveChangesAsync();
    }
}