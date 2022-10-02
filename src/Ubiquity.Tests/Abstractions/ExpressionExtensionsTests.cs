using System.Diagnostics;
using System.Linq.Expressions;
using Ubiquity.Abstractions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Tests.Abstractions;

public class ExpressionExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    private class Record<T>
    {
        public T? Value { get; set; }
    };

    public ExpressionExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", null)]
    [InlineData("02", 5)]
    public void ToPredicate(string id, int? value)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var record = new Record<int?> { Value = value };

        // Act
        var expression = value.ToPredicate<Record<int?>, int?>(v => x => x.Value == v);

        // Assert
        if (value is not null)
        {
            Assert.IsAssignableFrom<Expression<Func<Record<int?>, bool>>>(expression);
            Assert.True(expression!.Compile()(record));
        }
        else
            Assert.Null(expression);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void ToPredicate_Fails(string id, int? value, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var record = new Record<int?> { Value = value };

        // Act
        var exception = Assert.Throws(exceptionType, () => value.ToPredicate<Record<int?>, int?>(null!));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("01", null)]
    [InlineData("02", "")]
    [InlineData("03", "test")]
    public void ToPredicate_String(string id, string value)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var record = new Record<string> { Value = value };

        // Act
        var expression = value.ToPredicate<Record<string>>(v => x => x.Value == v);

        // Assert
        if (!string.IsNullOrEmpty(value))
        {
            Assert.IsAssignableFrom<Expression<Func<Record<string>, bool>>>(expression);
            Assert.True(expression!.Compile()(record));
        }
        else
            Assert.Null(expression);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void ToPredicate_StringFails(string id, string value, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var record = new Record<string> { Value = value };

        // Act
        var exception = Assert.Throws(exceptionType, () => value.ToPredicate<Record<string>>(null!));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }
}