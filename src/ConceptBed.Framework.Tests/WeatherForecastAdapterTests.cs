using ConceptBed.Data;
using ConceptBed.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Ubiquity.Data;
using Xunit;
using Xunit.Abstractions;

namespace ConceptBed.Framework.Tests;

public class WeatherForecastAdapterTests
{
    protected ITestOutputHelper Output { get; }

    private static readonly Guid _id0 = Guid.Parse("d76f18ea-ec6f-4477-8f1d-3e89820a0abe");
    private static readonly Guid _id1 = Guid.Parse("69cdc333-9a2f-4e57-b581-d58f325b50fe");
    private static readonly string _name1 = "Entity name 1";
    private static readonly Guid _id2 = Guid.Parse("e7ec8908-26b0-4bea-8ce1-de26d51b6331");
    private static readonly string _name2 = "Entity name 2";
    private static readonly Guid _id3 = Guid.Parse("f2a78dfd-7c1a-4830-adb6-7b8ab191c685");
    private static readonly string _name3 = "Entity name 3";
    private readonly IEnumerable<WeatherForecast> _dataSource = new[]
    {
        new WeatherForecast { Id = _id1, Date = DateTime.UtcNow, Temperature = 100, Summary = _name1, Status = WeatherForecastStatus.Active },
        new WeatherForecast { Id = _id2, Date = DateTime.UtcNow, Temperature = 100, Summary = _name2, Status = WeatherForecastStatus.Active },
        new WeatherForecast { Id = _id3, Date = DateTime.UtcNow, Temperature = 100, Summary = _name3, Status = WeatherForecastStatus.Active }
    };

    public WeatherForecastAdapterTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);

        // Act
        var adapter = new WeatherForecastAdapter(unitOfWork);

        // Assert
        Assert.NotNull(adapter);
        Assert.Equal(unitOfWork, adapter.UnitOfWork);
    }

    [Fact]
    public async Task GetQuery()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);
        var adapter = new WeatherForecastAdapter(unitOfWork);

        // Act
        var result = adapter.GetQuery();
        var results = await result.ToListAsync();

        // Assert
        Assert.IsAssignableFrom<DbSet<WeatherForecast>>(result);
        Assert.Equal(_dataSource, results);
    }

    public static IEnumerable<object?[]> GetFindData() => new[]
    {
        new object?[] { "01", _id0.ToString() },
        new object?[] { "02", _id1.ToString() },
    };

    [Theory]
    [MemberData(nameof(GetFindData))]
    public async Task Find(string testId, string id)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);
        var adapter = new WeatherForecastAdapter(unitOfWork);
        var expectedResult = _dataSource.FirstOrDefault(x => x.Id == Guid.Parse(id));

        // Act
        var result = await adapter.FindAsync(Guid.Parse(id));

        // Assert
        Assert.Equal(expectedResult, result);
        if (expectedResult is not null)
        {
            Assert.Equal(Guid.Parse(id), result.Id);
            Assert.Equal(expectedResult.Summary, result.Summary);
        }
    }

    public static IEnumerable<object?[]> GetGetData() => new[]
    {
        new object?[] { "01", null, null, new[] { _id1, _id2, _id3 }.Select(x => x.ToString()).ToArray() },
    };

    [Theory]
    [MemberData(nameof(GetGetData))]
    public async Task Get(string testId, string filterBy, string queryBy, string[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);
        var adapter = new WeatherForecastAdapter(unitOfWork);
        var expectedResult = _dataSource.Where(x => ids.Contains(x.Id.ToString()));

        // Act
        var result = await adapter.GetAsync(filterBy, queryBy);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [MemberData(nameof(GetGetData))]
    public async Task GetPage(string testId, string filterBy, string queryBy, string[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);
        var adapter = new WeatherForecastAdapter(unitOfWork);
        var expectedResult = _dataSource.Where(x => ids.Contains(x.Id.ToString())).ToList();

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