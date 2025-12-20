using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using ChatConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatConnect.Infrastructure.Persistence.Repositories
{
    public class GroupMessageRepository : IGroupMessageRepository
    {
        private readonly AppDbContext _context;

        public GroupMessageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(GroupMessage message)
        {
            await _context.GroupMessages.AddAsync(message);
        }

        public async Task<List<GroupMessageDto>> GetByGroupAsync(int groupId)
        {
            var messages = await _context.GroupMessages
                .Include(gm => gm.Sender)
                .Where(gm => gm.GroupId == groupId)
                .OrderBy(gm => gm.CreatedAt)
                .Select(gm => new GroupMessageDto
                {
                    Id = gm.Id,
                    GroupId = gm.GroupId,
                    SenderId = gm.SenderId,
                    SenderName = gm.Sender.Username,
                    Content = gm.Content,
                    IsImage = gm.IsImage,
                    CreatedAt = gm.CreatedAt
                })
                .ToListAsync();
            return messages;
        }

        public async Task<bool> DeleteAsync(int messageId, int userId)
        {
            var message = await _context.GroupMessages.FirstOrDefaultAsync(gm => gm.Id == messageId && gm.SenderId == userId);
            if (message != null)
            {
                _context.GroupMessages.Remove(message);
                return true;
            }
            return false;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}