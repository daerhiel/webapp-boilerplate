using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Ubiquity.Data;
using Ubiquity.Data.Tests.Xunit;
using Ubiquity.Framework.Tests.Xunit;

namespace Ubiquity.Framework.Tests;

public class AdapterTests
{
    protected ITestOutputHelper Output { get; }

    private static readonly int _id0 = 001;
    private static readonly int _id1 = 101;
    private static readonly string _name1 = "Entity name 1";
    private static readonly int _id2 = 102;
    private static readonly string _name2 = "Entity name 2";
    private static readonly int _id3 = 103;
    private static readonly string _name3 = "Entity name 3";
    private readonly IEnumerable<Entity> _dataSource = new[]
    {
        new Entity { Id = _id1, Name = _name1 },
        new Entity { Id = _id2, Name = _name2 },
        new Entity { Id = _id3, Name = _name3 }
    };

    public AdapterTests(ITestOutputHelper output)
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

    [Fact]
    public async Task GetQuery()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var context = new EntityContext().StoreRange(_dataSource);
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);

        // Act
        var result = adapter.GetQuery();
        var results = await result.ToListAsync();

        // Assert
        Assert.IsAssignableFrom<DbSet<Entity>>(result);
        Assert.Equal(_dataSource, results);
    }

    public static IEnumerable<object?[]> GetFindData() => new[]
    {
        new object?[] { "01", _id0 },
        new object?[] { "02", _id1 },
    };

    [Theory]
    [MemberData(nameof(GetFindData))]
    public async Task Find(string testId, int id)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var context = new EntityContext().StoreRange(_dataSource);
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);
        var expectedResult = _dataSource.FirstOrDefault(x => x.Id == id);

        // Act
        var result = await adapter.FindAsync(id);

        // Assert
        Assert.Equal(expectedResult, result);
        if (expectedResult is not null)
        {
            Assert.Equal(id, result.Id);
            Assert.Equal(expectedResult.Name, result.Name);
        }
    }

    public static IEnumerable<object?[]> GetGetData() => new[]
    {
        new object?[] { "01", null, null, new[] { _id1, _id2, _id3 }.Select(x => x).ToArray() },
    };

    [Theory]
    [MemberData(nameof(GetGetData))]
    public async Task Get(string testId, string filterBy, string queryBy, int[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var context = new EntityContext().StoreRange(_dataSource);
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);
        var expectedResult = _dataSource.Where(x => ids.Contains(x.Id));

        // Act
        var result = await adapter.GetAsync(filterBy, queryBy);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [MemberData(nameof(GetGetData))]
    public async Task GetPage(string testId, string filterBy, string queryBy, int[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var context = new EntityContext().StoreRange(_dataSource);
        var unitOfWork = new EntityUnitOfWork(context);
        var adapter = new EntityAdapter(unitOfWork);
        var expectedResult = _dataSource.Where(x => ids.Contains(x.Id)).ToList();

        // Act
        var result = await adapter.GetPageAsync(filterBy, queryBy);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.IndexFrom);
        Assert.Equal(0, result.PageIndex);
        Assert.Equal(20, result.PageSize);
        Assert.Equal(1, result.TotalPages);
        Assert.Equal(expectedResult.Count, result.TotalCount);
        Assert.Equivalent(expectedResult, result.Items, true);
        Assert.False(result.HasNextPage);
        Assert.False(result.HasPreviousPage);
    }
}