using System.Diagnostics;

namespace ConceptBed.Data.Tests;

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