using System.Diagnostics;
using Ubiquity.Data.Tests.Xunit;

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
        var result = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var value = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, result);
        Assert.Equal(result, value);
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
        var result = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var value = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, result);
        Assert.Equal(result, value);
        Assert.Equal(name, value!.Name);
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
        var result = context.PushUpdate(entity);
        context.SaveChanges();

        // Assert
        var value = context.Set<Entity>().Find(entity.Id);
        Assert.Equal(entity, result);
        Assert.Null(value);
    }
}
