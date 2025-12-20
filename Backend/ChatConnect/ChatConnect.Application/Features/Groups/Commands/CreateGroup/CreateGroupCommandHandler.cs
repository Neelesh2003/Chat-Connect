using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using MediatR;


namespace ChatConnect.Application.Features.Groups.Commands.CreateGroup
{
    public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, GroupDto>
    {
        private readonly IGroupRepository _groupRepository;

        public CreateGroupCommandHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<GroupDto> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            var group = new Group
            {
                Name = request.Name,
                CreatedBy = request.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _groupRepository.AddAsync(group);
            await _groupRepository.SaveChangesAsync();

            // Add creator as member
            await _groupRepository.AddMemberAsync(group.Id, request.CreatedBy);

            // Add other members
            foreach (var memberId in request.MemberIds)
            {
                if (memberId != request.CreatedBy)
                    await _groupRepository.AddMemberAsync(group.Id, memberId);
            }

            await _groupRepository.SaveChangesAsync();

            return new GroupDto { Id = group.Id, Name = group.Name, CreatedBy = group.CreatedBy, CreatedAt = group.CreatedAt };
        }
    }
}