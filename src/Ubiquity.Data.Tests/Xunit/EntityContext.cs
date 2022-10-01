using Microsoft.EntityFrameworkCore;
using Ubiquity.Data.Tests.Engine;

namespace Ubiquity.Data.Tests.Testing;

public class EntityContext : StaticDbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        var entity = modelBuilder.Entity<Entity>();
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Id).ValueGeneratedOnAdd();
        entity.Property(x => x.Name);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseInMemoryDatabase($"EntityDb_{Guid.NewGuid()}");
    }
}