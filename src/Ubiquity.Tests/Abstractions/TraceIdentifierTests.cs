using System.Diagnostics;
using Ubiquity.Abstractions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Tests.Abstractions;

public class TraceIdentifierTests
{
    protected ITestOutputHelper Output { get; }

    public TraceIdentifierTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", 1)]
    [InlineData("02", 2)]
    [InlineData("03", 3)]
    [InlineData("04", 8)]
    [InlineData("05", 10)]
    [InlineData("06", 100)]
    public void GenerateId(string testId, int length)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var set = "".ToHashSet();

        // Act
        var result = TraceIdentifier.GenerateId(length);

        // Assert
        Assert.Equal(length, result.Length);
        Assert.All(result, x => set.Contains(x));
    }

    [Theory]
    [InlineData("01", 0, typeof(ArgumentOutOfRangeException))]
    [InlineData("02", -1, typeof(ArgumentOutOfRangeException))]
    public void GenerateId_Fails(string testId, int length, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var set = "".ToHashSet();

        // Act
        var exception = Assert.Throws(exceptionType, () => TraceIdentifier.GenerateId(length));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }
}