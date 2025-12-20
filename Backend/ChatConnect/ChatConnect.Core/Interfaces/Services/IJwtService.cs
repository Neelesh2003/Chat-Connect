using ChatConnect.Core.Entities;

namespace ChatConnect.Core.Interfaces.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}