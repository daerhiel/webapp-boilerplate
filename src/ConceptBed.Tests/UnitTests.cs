using System.Diagnostics;
using Xunit.Abstractions;

namespace ConceptBed.Tests;

public class UnitTests
{
    protected ITestOutputHelper Output { get; }

    public UnitTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01")]
    public void Template(string testId)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act

        // Assert
    }
}