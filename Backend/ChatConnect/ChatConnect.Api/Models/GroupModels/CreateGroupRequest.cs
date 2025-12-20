namespace ChatConnect.Api.Models.GroupModels
{
    public class CreateGroupRequest
    {
        public string Name { get; set; } = string.Empty;
        public List<int>? Members { get; set; }
    }
}