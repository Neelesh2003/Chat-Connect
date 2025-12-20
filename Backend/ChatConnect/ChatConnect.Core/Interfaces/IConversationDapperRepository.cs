using ChatConnect.Core.DTOs;

namespace ChatConnect.Core.Interfaces
{
    public interface IConversationDapperRepository
    {
        Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2);
    }
}