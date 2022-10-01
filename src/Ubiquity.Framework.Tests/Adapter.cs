using System.Diagnostics;
using Ubiquity.Data.Tests.Engine;
using Ubiquity.Data.Tests.Testing;
using Ubiquity.Framework.Tests.Testing;

namespace Ubiquity.Framework.Tests;

public class UnitTests
{
    protected ITestOutputHelper Output { get; }

    private static readonly Guid _guid0 = Guid.NewGuid();
    private static readonly Guid _guid1 = Guid.NewGuid();
    private static readonly string _name1 = "Entity name 1";
    private static readonly Guid _guid2 = Guid.NewGuid();
    private static readonly string _name2 = "Entity name 2";
    private static readonly Guid _guid3 = Guid.NewGuid();
    private static readonly string _name3 = "Entity name 3";
    private readonly IEnumerable<Entity> _dataSource = new[]
    {
        new Entity() { Guid = _guid1, Name = _name1 },
        new Entity() { Guid = _guid2, Name = _name2 },
        new Entity() { Guid = _guid3, Name = _name3 }
    };

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
        var context = new EntityContext().Setup(_dataSource);
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);

        // Act
        var entity = await adapter.FindAsync(_guid1);

        // Assert
        Assert.NotNull(entity);
        Assert.Equal(_guid1, entity.Guid);
        Assert.Equal(_name1, entity.Name);
    }
}