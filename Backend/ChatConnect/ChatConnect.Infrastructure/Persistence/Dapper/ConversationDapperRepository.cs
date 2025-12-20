using ChatConnect.Core.DTOs;
using ChatConnect.Core.Interfaces;
using Dapper;
using Npgsql;

namespace ChatConnect.Infrastructure.Persistence.Dapper
{
    public class ConversationDapperRepository : IConversationDapperRepository
    {
        private readonly string _connectionString;

        public ConversationDapperRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                SELECT m.Id, m.SenderId, s.Username as SenderName, m.ReceiverId, r.Username as ReceiverName, 
                       m.Content, m.IsImage, m.CreatedAt
                FROM Messages m
                INNER JOIN Users s ON m.SenderId = s.Id
                INNER JOIN Users r ON m.ReceiverId = r.Id
                WHERE (m.SenderId = @UserId1 AND m.ReceiverId = @UserId2)
                   OR (m.SenderId = @UserId2 AND m.ReceiverId = @UserId1)
                ORDER BY m.CreatedAt";

            var messages = await connection.QueryAsync<MessageDto>(sql, new { UserId1 = userId1, UserId2 = userId2 });
            return messages.ToList();
        }
    }
}