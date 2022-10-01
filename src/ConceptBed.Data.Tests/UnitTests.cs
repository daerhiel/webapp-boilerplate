using System.Diagnostics;

namespace ConceptBed.Data.Tests;

public class UnitTests
{
    protected ITestOutputHelper Output { get; }

    public UnitTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange

        // Act

        // Assert
    }

    [Theory]
    [InlineData("01")]
    public void Template(string id)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange

        // Act

        // Assert
    }
}