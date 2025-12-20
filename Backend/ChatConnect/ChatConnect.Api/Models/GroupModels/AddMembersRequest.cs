using System.ComponentModel.DataAnnotations;

namespace ChatConnect.Api.Models.GroupModels
{
    public class AddMembersRequest
    {
        [Required]
        public List<int> Members { get; set; } = new();
    }
}