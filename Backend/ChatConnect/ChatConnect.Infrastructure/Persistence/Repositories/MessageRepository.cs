using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using ChatConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace ChatConnect.Infrastructure.Persistence.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _context;

        public MessageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        public async Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2)
        {
            // Use Dapper for performance on large histories (injected separately)
            // For now, EF; delegate to Dapper repo in handlers if needed
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2) ||
                            (m.SenderId == userId2 && m.ReceiverId == userId1))
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.Username,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    IsImage = m.IsImage,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
            return messages;
        }

        public async Task<bool> DeleteAsync(int messageId, int userId)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == messageId && m.SenderId == userId);
            if (message != null)
            {
                _context.Messages.Remove(message);
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