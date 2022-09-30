using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Ubiquity.Data.Tests.Engine;

namespace Ubiquity.Data.Tests;

public class EntityExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    private record Entity
    {
        public Guid Guid { get; set; }
        public string? Name { get; set; }
    }

    private class EntityContext : StaticDbContext
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
        context.Add(entity);
        var expected = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var actual = context.Set<Entity>().Find(entity.Guid);
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void PushUpdate_Update()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var guid = Guid.NewGuid();
        var name = "Updated name";
        var context = new EntityContext();
        context.Setup(new Entity() { Guid = guid, Name = "Entity name" });
        var entity = context.Set<Entity>().Find(guid)!;

        // Act
        entity.Name = name;
        var expected = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var actual = context.Set<Entity>().Find(entity.Guid);
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
        Assert.Equal(name, actual!.Name);
    }

    [Fact]
    public void PushUpdate_Delete()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var guid = Guid.NewGuid();
        var context = new EntityContext();
        context.Setup(new Entity() { Guid = guid, Name = "Entity name" });
        var entity = context.Set<Entity>().Find(guid)!;

        // Act
        context.Remove(entity);
        var expected = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var actual = context.Set<Entity>().Find(entity.Guid);
        Assert.Equal(entity, expected);
        Assert.Null(actual);
    }
}
