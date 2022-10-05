using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ConceptBed.Data.Tests;

public class ConceptContextTests
{
    protected ITestOutputHelper Output { get; }

    public ConceptContextTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");

        // Act
        var context = new ConceptContext(options.Options);

        // Assert
        Assert.NotNull(context);
        Assert.NotNull(context.Database);
        Assert.NotNull(context.Forecasts);
    }
}