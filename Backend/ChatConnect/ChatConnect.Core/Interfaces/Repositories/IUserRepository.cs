using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;

namespace ChatConnect.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<List<UserDto>> GetAllAsync(bool excludeCurrent = true, int currentUserId = 0);
        Task AddAsync(User user);
        Task UpdateOnlineStatusAsync(int userId, bool isOnline);
        Task SaveChangesAsync();
    }
}