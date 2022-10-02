using System.Diagnostics;
using Xunit.Abstractions;
using Xunit;
using Ubiquity.Abstractions;

namespace Ubiquity.Tests.Abstractions;

public class StringExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    public StringExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", null, "<null>", "<null>")]
    [InlineData("02", 0, "<null>", "0")]
    [InlineData("03", 5, "<null>", "5")]
    public void GetString(string testId, int? value, string fallback, string expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var result = value.GetString(fallback);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", null, "<null>", "<null>")]
    [InlineData("02", "", "<null>", "<null>")]
    [InlineData("03", "Test", "<null>", "Test")]
    public void GetString_String(string testId, string value, string fallback, string expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var result = value.GetString(fallback);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", null, "<null>", "<null>")]
    [InlineData("02", 0, "<null>", "'0'")]
    [InlineData("03", 5, "<null>", "'5'")]
    public void GetString_Formatter(string testId, int? value, string fallback, string expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var result = value.GetString(x => $"'{x}'", fallback);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", null, "<null>", typeof(ArgumentNullException))]
    public void GetString_FormatterFails(string testId, int? value, string fallback, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => value.GetString(null!, fallback));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("01", null, "<null>", "<null>")]
    [InlineData("02", "", "<null>", "<null>")]
    [InlineData("03", "Test", "<null>", "'Test'")]
    public void GetString_FormatterString(string testId, string value, string fallback, string expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var result = value.GetString(x => $"'{x}'", fallback);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", null, "<null>", typeof(ArgumentNullException))]
    public void GetString_FormatterStringFails(string testId, string value, string fallback, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => value.GetString(null!, fallback));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }
}