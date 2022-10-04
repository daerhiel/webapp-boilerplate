using System.Diagnostics;
using Ubiquity.Data.Tests.Testing;

namespace Ubiquity.Data.Tests;

public class EntityExtensionsTests
{
    protected ITestOutputHelper Output { get; }

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
        var actual = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void PushUpdate_Update()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var id = 100;
        var name = "Updated name";
        var context = new EntityContext().StoreRange(new Entity() { Id = id, Name = "Entity name" });
        var entity = context.Set<Entity>().Find(id)!;

        // Act
        entity.Name = name;
        var expected = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var actual = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, expected);
        Assert.Equal(expected, actual);
        Assert.Equal(name, actual!.Name);
    }

    [Fact]
    public void PushUpdate_Delete()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var id = 100;
        var context = new EntityContext().StoreRange(new Entity() { Id = id, Name = "Entity name" });
        var entity = context.Set<Entity>().Find(id)!;

        // Act
        context.Remove(entity);
        var expected = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var actual = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, expected);
        Assert.Null(actual);
    }
}
