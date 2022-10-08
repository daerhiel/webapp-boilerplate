using System.Diagnostics;
using Xunit.Abstractions;
using Xunit;
using Ubiquity.Abstractions;

namespace Ubiquity.Tests.Abstractions;

public class ActionExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    private class Record
    {
        public int Value { get; set; }
    };

    public ActionExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", 1, 2, 2)]
    public void Apply(string traceId, int oldValue, int newValue, int expectedValue)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var record = new Record { Value = oldValue };

        // Act
        var result = record.Apply(x => x.Value = newValue);

        // Assert
        Assert.Equal(record, result);
        Assert.Equal(expectedValue, result.Value);
    }

    [Theory]
    [InlineData("01", 1, typeof(ArgumentNullException))]
    public void Apply_Fails(string traceId, int value, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var record = new Record { Value = value };

        // Act
        var exception = Assert.Throws(exceptionType, () => record.Apply(null!));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("01", false, 1, 2, 1)]
    [InlineData("01", true, 1, 2, 2)]
    public void ApplyIf(string traceId, bool condition, int oldValue, int newValue, int expectedValue)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var record = new Record { Value = oldValue };

        // Act
        var result = record.ApplyIf(condition, x => x.Value = newValue);

        // Assert
        Assert.Equal(record, result);
        Assert.Equal(expectedValue, result.Value);
    }

    [Theory]
    [InlineData("01", false, 1, typeof(ArgumentNullException))]
    public void ApplyIf_Fails(string traceId, bool condition, int value, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var record = new Record { Value = value };

        // Act
        var exception = Assert.Throws(exceptionType, () => record.ApplyIf(condition, null!));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("01", new[] { 1 }, 2, 2)]
    public void ApplyAll(string traceId, int[] oldValues, int newValue, int expectedValue)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var records = oldValues.Select(x => new Record { Value = x }).ToArray();

        // Act
        var result = records.ApplyAll(x => x.Value = newValue);

        // Assert
        Assert.All(result, x => Assert.Equal(expectedValue, x.Value));
    }

    [Theory]
    [InlineData("01", new[] { 1 }, typeof(ArgumentNullException))]
    public void ApplyAll_Fails(string traceId, int[] oldValues, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange
        var records = oldValues.Select(x => new Record { Value = x }).ToArray();

        // Act
        var exception = Assert.Throws(exceptionType, () => records.ApplyAll(null!));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("01", false, 1, 2, 2)]
    [InlineData("01", true, 1, 2, 1)]
    public void CreateIf(string traceId, bool condition, int value, int fallback, int expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange

        // Act
        var result = condition.CreateIf(() => value, fallback);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", false, 2, typeof(ArgumentNullException))]
    public void CreateIf_Fails(string traceId, bool condition, int fallback, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {traceId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => condition.CreateIf(null!, fallback));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }
}