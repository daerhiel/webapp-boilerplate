using System.Diagnostics;
using Ubiquity.Data.Tests.Engine;
using Ubiquity.Data.Tests.Testing;
using Ubiquity.Framework.Tests.Testing;

namespace Ubiquity.Framework.Tests;

public class UnitTests
{
    protected ITestOutputHelper Output { get; }

    public UnitTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var context = new EntityContext();
        var unitOfWork = new EntityUnitOfWork(context);

        // Act
        var adapter = new EntityAdapter(unitOfWork);

        // Assert
        Assert.NotNull(adapter);
        Assert.Equal(unitOfWork, adapter.UnitOfWork);
    }

    [Theory]
    [InlineData("01")]
    public async Task Find(string id)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var guid = Guid.NewGuid();
        var name = "Entity name";
        var context = new EntityContext();
        context.Setup(new Entity() { Guid = guid, Name = name });
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);

        // Act
        var entity = await adapter.FindAsync(guid);

        // Assert
        Assert.NotNull(entity);
        Assert.Equal(guid, entity.Guid);
        Assert.Equal(name, entity.Name);
    }
}