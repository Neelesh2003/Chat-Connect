using ChatConnect.Core.DTOs;

namespace ChatConnect.Api.Models.AuthModels
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}