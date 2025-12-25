using ChatConnect.Core.DTOs;
using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces.Repositories;
using ChatConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatConnect.Infrastructure.Persistence.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly AppDbContext _context;

        public GroupRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Core.Entities.Group group)
        {
            await _context.Groups.AddAsync(group);
        }

        public async Task<bool> AddMemberAsync(int groupId, int userId)
        {
            var existing = await _context.GroupMembers.AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
            if (existing) return false;

            var member = new GroupMember { GroupId = groupId, UserId = userId };
            await _context.GroupMembers.AddAsync(member);
            return true;
        }

        public async Task<bool> IsMemberAsync(int groupId, int userId)
        {
            return await _context.GroupMembers.AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
        }


       public async Task<List<GroupMemberDto>> GetGroupMembersAsync(int groupId)
        {
            return await _context.GroupMembers.Select(x => new GroupMemberDto
            {
                GroupId = groupId,
                UserId = x.UserId
            }
            ).Where(x => x.GroupId == groupId).ToListAsync();
        }

        public async Task<List<GroupDto>> GetUserGroupsAsync()
        { return await _context.Groups.Select(g => new GroupDto
        {
            Id = g.Id,
            Name = g.Name,
            CreatedBy = g.CreatedBy,
            CreatedAt = g.CreatedAt

        }).ToListAsync();
      
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}