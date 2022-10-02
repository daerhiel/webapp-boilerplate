using System.Diagnostics;
using System.Net;

namespace Ubiquity.Framework.Tests;

public class FrameworkExceptionTests
{
    protected ITestOutputHelper Output { get; }

    public FrameworkExceptionTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange

        // Act
        var exception = new FrameworkException();

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        Assert.Equal($"Exception of type '{exception.GetType()}' was thrown.", exception.Message);
        Assert.Null(exception.InnerException);
    }

    [Theory]
    [InlineData("01", HttpStatusCode.InternalServerError)]
    [InlineData("02", HttpStatusCode.BadRequest)]
    [InlineData("03", HttpStatusCode.Unauthorized)]
    public void Ctor_Code(string testId, HttpStatusCode code)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = new FrameworkException(code);

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(code, exception.StatusCode);
        Assert.Equal($"Exception of type '{exception.GetType()}' was thrown.", exception.Message);
        Assert.Null(exception.InnerException);
    }

    [Theory]
    [InlineData("01", "The exception was thrown.")]
    [InlineData("02", "The exception was thrown.")]
    [InlineData("03", "The exception was thrown.")]
    public void Ctor_Message(string testId, string message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = new FrameworkException(message);

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        Assert.Equal(message, exception.Message);
        Assert.Null(exception.InnerException);
    }

    [Theory]
    [InlineData("01", HttpStatusCode.InternalServerError, "The exception was thrown.")]
    [InlineData("02", HttpStatusCode.BadRequest, "The exception was thrown.")]
    [InlineData("03", HttpStatusCode.Unauthorized, "The exception was thrown.")]
    public void Ctor_CodeMessage(string testId, HttpStatusCode code, string message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = new FrameworkException(code, message);

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(code, exception.StatusCode);
        Assert.Equal(message, exception.Message);
        Assert.Null(exception.InnerException);
    }

    [Theory]
    [InlineData("01", "The exception was thrown.")]
    [InlineData("02", "The exception was thrown.")]
    [InlineData("03", "The exception was thrown.")]
    public void Ctor_MessageInner(string testId, string message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var inner = new Exception();

        // Act
        var exception = new FrameworkException(message, inner);

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        Assert.Equal(message, exception.Message);
        Assert.Equal(inner, exception.InnerException);
    }

    [Theory]
    [InlineData("01", HttpStatusCode.InternalServerError, "The exception was thrown.")]
    [InlineData("02", HttpStatusCode.BadRequest, "The exception was thrown.")]
    [InlineData("03", HttpStatusCode.Unauthorized, "The exception was thrown.")]
    public void Ctor_CodeMessageInner(string testId, HttpStatusCode code, string message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var inner = new Exception();

        // Act
        var exception = new FrameworkException(code, message, inner);

        // Assert
        Assert.NotNull(exception);
        Assert.Equal(code, exception.StatusCode);
        Assert.Equal(message, exception.Message);
        Assert.Equal(inner, exception.InnerException);
    }
}