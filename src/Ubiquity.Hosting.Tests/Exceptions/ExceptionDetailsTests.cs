using System.Diagnostics;
using Ubiquity.Abstractions;
using Ubiquity.Hosting.Exceptions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Hosting.Tests.Exceptions;

public class ExceptionDetailsTests
{
    protected ITestOutputHelper Output { get; }

    public ExceptionDetailsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", "Not enough memory.", false)]
    [InlineData("02", "Not enough memory.", true)]
    public void Ctor(string testId, string? message, bool includeDetails)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var exception = new AggregateException(message, new OutOfMemoryException(), new ArithmeticException());

        // Act
        var details = new ExceptionDetails(exception, includeDetails);

        // Assert
        Assert.NotNull(details);
        Assert.Equal(exception.GetType().FormatFullName(), details.Category);
        Assert.Equal(exception.Message, details.Message);
        if (includeDetails)
        {
            Assert.Equal(exception.StackTrace, details.StackTrace);
            Assert.NotNull(details.Inner);
            Assert.Equal(exception.InnerException!.GetType().FormatFullName(), details.Inner.Category);
            Assert.Equal(exception.InnerException!.Message, details.Inner.Message);
        }
        else
        {
            Assert.Null(details.StackTrace);
            Assert.Null(details.Inner);
        }
    }
}