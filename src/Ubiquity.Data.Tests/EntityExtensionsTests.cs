using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Data.Tests;

public class EntityExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    private record Entity
    {
        public Guid Guid { get; set; }
        public string? Name { get; set; }
    }

    private class EntityContext : DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var entity = modelBuilder.Entity<Entity>();
            entity.HasKey(x => x.Guid);
            entity.Property(x => x.Guid).ValueGeneratedOnAdd();
            entity.Property(x => x.Name);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseInMemoryDatabase("EntityDb");
        }
    }

    public EntityExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void PushUpdate_Add()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var context = new EntityContext();
        var entity = new Entity() { Name = "Entity name" };

        // Act
        var expected = context.PushUpdate(entity);
        var actual = context.Set<Entity>().Find(entity.Guid);

        // Assert
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void PushUpdate_Update()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var name = "Updated name";
        var context = new EntityContext();
        var entity = new Entity() { Name = "Entity name" };
        context.Add(entity);

        // Act
        entity.Name = name;
        var expected = context.PushUpdate(entity);
        var actual = context.Set<Entity>().Find(entity.Guid);

        // Assert
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
        Assert.Equal(name, actual!.Name);
    }
}
