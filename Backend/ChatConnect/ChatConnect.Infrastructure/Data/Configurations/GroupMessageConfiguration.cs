using ChatConnect.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChatConnect.Infrastructure.Data.Configurations
{
    public class GroupMessageConfiguration : IEntityTypeConfiguration<GroupMessage>
    {
        public void Configure(EntityTypeBuilder<GroupMessage> builder)
        {
            builder.HasKey(gm => gm.Id);
            builder.Property(gm => gm.Content).IsRequired().HasMaxLength(5000);
            builder.Property(gm => gm.IsImage).IsRequired().HasDefaultValue(false);

            builder.HasOne(gm => gm.Group).WithMany(g => g.Messages).HasForeignKey(gm => gm.GroupId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(gm => gm.Sender).WithMany().HasForeignKey(gm => gm.SenderId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}