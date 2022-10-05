using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using ConceptBed.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Ubiquity.Data;

namespace ConceptBed.Data.Tests;

public class ConceptUnitOfWorkTests
{
    protected ITestOutputHelper Output { get; }

    private const string _idtextx = "f4f3123d-b98c-456e-bd11-599eaa7a3827";
    private const string _idtext0 = "d76f18ea-ec6f-4477-8f1d-3e89820a0abe";
    private const string _idtext1 = "69cdc333-9a2f-4e57-b581-d58f325b50fe";
    private const string _idtext2 = "e7ec8908-26b0-4bea-8ce1-de26d51b6331";
    private const string _idtext3 = "f2a78dfd-7c1a-4830-adb6-7b8ab191c685";
    private const string _idtext4 = "0762cbe9-9d2d-4bf5-a00e-1dacaf671a24";

    private static readonly Guid _id0 = Guid.Parse(_idtext0);
    private static readonly Guid _id1 = Guid.Parse(_idtext1);
    private static readonly Guid _id2 = Guid.Parse(_idtext2);
    private static readonly Guid _id3 = Guid.Parse(_idtext3);
    private static readonly Guid _id4 = Guid.Parse(_idtext4);

    private static readonly Guid[] _ids = new[] { _id0, _id1, _id2, _id3, _id4 };
    private static readonly IEnumerable<WeatherForecast> _dataSource = GetData().ToArray();

    public ConceptUnitOfWorkTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    private static IEnumerable<WeatherForecast> GetData()
    {
        var rng = new Random();
        return Enumerable.Range(0, 4).Select(index => new WeatherForecast
        {
            Id = _ids[index],
            Date = DateTime.Now.AddDays(index),
            Temperature = rng.Next(-20, 55),
            Summary = ConceptContext.Summaries[rng.Next(ConceptContext.Summaries.Length)],
            Status = WeatherForecastStatus.Active
        });
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options);

        // Act
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);

        // Assert
        Assert.NotNull(unitOfWork);
        Assert.Equal(context, unitOfWork.DbContext);
        Assert.Equal(context, ((IUnitOfWorkContext)unitOfWork).DbContext);
    }

    [Theory]
    [InlineData("01", false, false)]
    [InlineData("02", true, true)]
    public async Task LockWhenRequiredAsync(string testId, bool threadLock, bool expectedCompletion)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);


        // Act
        var completed = false;
        var parallelTask = Task.Run(async () =>
        {
            using (await unitOfWork.LockWhenRequiredAsync(threadLock))
            {
                await Task.Delay(100);
                completed = true;
            }
        });
        await Task.Delay(10);
        using (await unitOfWork.LockWhenRequiredAsync(threadLock))
        {
            Assert.Equal(expectedCompletion, completed);
        }

        // Assert
        await parallelTask;
        Assert.True(completed);
    }

    [Theory]
    [InlineData("01", _idtextx, false)]
    [InlineData("02", _idtext1, true)]
    public async Task GetForecastAsync(string testId, string id, bool exists)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);

        // Act
        var element = await unitOfWork.GetForecastAsync(x => x.Id == new Guid(id));

        // Assert
        if (exists)
        {
            Assert.NotNull(element);
            Assert.Equal(new Guid(id), element!.Id);
            var expectedElement = _dataSource.FirstOrDefault(x => x.Id == new Guid(id));
            Assert.Equivalent(expectedElement, element, true);
        }
        else
        {
            Assert.Null(element);
        }
    }

    [Theory]
    [InlineData("01", _idtextx)]
    [InlineData("02", _idtextx, _idtext1, _idtext3)]
    [InlineData("03", _idtext0, _idtext1, _idtext2)]
    public async Task GetForecastAllAsync(string testId, params string[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);

        // Act
        var elements = await unitOfWork.GetForecastsAllAsync(x => ids.Contains(x.Id.ToString()));

        // Assert
        Assert.NotNull(elements);
        var expectedElements = _dataSource.Where(x => ids.Contains(x.Id.ToString()));
        Assert.Equivalent(expectedElements, elements, true);
    }

    [Theory]
    [InlineData("01", _idtextx)]
    [InlineData("02", _idtextx, _idtext1, _idtext3)]
    [InlineData("03", _idtext0, _idtext1, _idtext2)]
    public async Task GetForecastsAsync(string testId, params string[] ids)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
        var context = new ConceptContext(options.Options).StoreRange(_dataSource);
        var unitOfWork = new ConceptUnitOfWork<ConceptContext>(context);

        // Act
        var elements = await unitOfWork.GetForecastsAsync(x => ids.Contains(x.Id.ToString()));

        // Assert
        Assert.NotNull(elements);
        var expectedElements = _dataSource.Where(x => ids.Contains(x.Id.ToString()));
        Assert.Equivalent(expectedElements.ToPagedList(0, 20), elements, true);
    }
}