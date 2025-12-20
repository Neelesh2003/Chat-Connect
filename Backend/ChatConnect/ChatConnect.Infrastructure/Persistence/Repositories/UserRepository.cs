using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using ChatConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatConnect.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<List<UserDto>> GetAllAsync(bool excludeCurrent = true, int currentUserId = 0)
        {
            var query = _context.Users.Select(u => new UserDto { Id = u.Id, Username = u.Username, IsOnline = u.IsOnline });
            if (excludeCurrent)
                query = query.Where(u => u.Id != currentUserId);
            return await query.ToListAsync();
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task UpdateOnlineStatusAsync(int userId, bool isOnline)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.IsOnline = isOnline;
                _context.Users.Update(user);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}