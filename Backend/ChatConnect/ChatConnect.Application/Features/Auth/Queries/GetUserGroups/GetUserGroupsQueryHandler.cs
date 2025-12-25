using ChatConnect.Core.Interfaces;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;

namespace ChatConnect.Application.Features.Groups.Queries.GetUserGroups
{
    public class GetUserGroupsQueryHandler : IRequestHandler<GetUserGroupsQuery, List<GroupDto>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetUserGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<List<GroupDto>> Handle(GetUserGroupsQuery request, CancellationToken cancellationToken)
        {
            var groups = await _groupRepository.GetUserGroupsAsync();

            return groups.Select(g => new GroupDto
            {
                Id = g.Id,
                Name = g.Name,
                CreatedBy = g.CreatedBy,
                CreatedAt = g.CreatedAt
            }).ToList();
        }
    }

    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}