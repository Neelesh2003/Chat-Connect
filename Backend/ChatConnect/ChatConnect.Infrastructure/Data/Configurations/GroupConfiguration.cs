using ChatConnect.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatConnect.Infrastructure.Data.Configurations
{
    public class GroupConfiguration : IEntityTypeConfiguration<Group>
    {
        public void Configure(EntityTypeBuilder<Group> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Name).IsRequired().HasMaxLength(100);

            builder.HasOne(g => g.CreatedByUser).WithMany().HasForeignKey(g => g.CreatedBy).OnDelete(DeleteBehavior.Restrict);
        }
    }
}