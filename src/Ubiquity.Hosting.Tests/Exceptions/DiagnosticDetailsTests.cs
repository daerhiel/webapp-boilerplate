using System.Diagnostics;
using System.Net;
using Ubiquity.Hosting.Exceptions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Hosting.Tests.Exceptions;

public class DiagnosticDetailsTests
{
    protected ITestOutputHelper Output { get; }

    public DiagnosticDetailsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", "Network", "Disconnected.", HttpStatusCode.BadRequest, "Port is closed.", "smb://server", "Not enough memory.")]
    public void Ctor(string testId, string? type, string? title, HttpStatusCode? status, string? detail, string? instance, string? message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var exception = new ExceptionDetails(new Exception(message), true);

        // Act
        var details = new DiagnosticDetails
        {
            Type = type,
            Title = title,
            Status = (int?)status,
            Detail = detail,
            Instance = instance,
            Exception = exception
        };

        // Assert
        Assert.NotNull(details);
        Assert.Equal(type, details.Type);
        Assert.Equal(title, details.Title);
        Assert.Equal((int?)status, details.Status);
        Assert.Equal(detail, details.Detail);
        Assert.Equal(instance, details.Instance);
        Assert.Equal(exception, details.Exception);
    }
}