namespace ChatConnect.Core.DTOs
{
    public class AuthResultDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}