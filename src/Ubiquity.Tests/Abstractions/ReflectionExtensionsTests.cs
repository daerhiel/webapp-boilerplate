using System.Collections;
using System.Diagnostics;
using System.Text.RegularExpressions;
using Ubiquity.Abstractions;
using Ubiquity.Tests.Xunit;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Tests.Abstractions;

public class ReflectionExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    private static readonly Regex _pattern = new("`\\d+", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public ReflectionExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    public static IEnumerable<object?[]> GetFormatNameData()
    {
        yield return "01".Build(typeof(Type), x => "Type");
        yield return "02".Build(typeof(List<object>), x => "List");
        yield return "03".Build(typeof(Dictionary<int, object>), x => "Dictionary");
    }

    [Theory]
    [MemberData(nameof(GetFormatNameData))]
    public void FormatName(string testId, Type type, string expectedName)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var name = type.FormatName();

        // Assert
        Assert.Equal(expectedName, name);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void FormatName_Fails(string testId, Type type, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.FormatName());

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    public static IEnumerable<object?[]> GetFormatFullNameData()
    {
        yield return "01".Build(typeof(Type), x => "Type");
        yield return "02".Build(typeof(List<object>), x => "List[Object]");
        yield return "03".Build(typeof(Dictionary<int, object>), x => "Dictionary[Int32,Object]");
        yield return "04".Build(typeof(List<Task<int>>), x => "List[Task[Int32]]");
        yield return "05".Build(typeof(Dictionary<Task<int>, object>), x => "Dictionary[Task[Int32],Object]");
        yield return "06".Build(typeof(Dictionary<int, Task<object>>), x => "Dictionary[Int32,Task[Object]]");
        yield return "07".Build(typeof(Dictionary<Task<int>, Task<object>>), x => "Dictionary[Task[Int32],Task[Object]]");
    }

    [Theory]
    [MemberData(nameof(GetFormatFullNameData))]
    public void FormatFullName(string testId, Type type, string expectedName)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var name = type.FormatFullName();

        // Assert
        Assert.Equal(expectedName, name);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void FormatFullName_Fails(string testId, Type type, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.FormatFullName());

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    public static IEnumerable<object?[]> GetFormatHostNameData()
    {
        yield return "01".Build(typeof(Type), x => "type");
        yield return "02".Build(typeof(List<object>), x => "object.list");
        yield return "03".Build(typeof(Dictionary<int, object>), x => "object-int32.dictionary");
        yield return "04".Build(typeof(List<Task<int>>), x => "task#int32.list");
        yield return "05".Build(typeof(Dictionary<Task<int>, object>), x => "object-task#int32.dictionary");
        yield return "06".Build(typeof(Dictionary<int, Task<object>>), x => "task#object-int32.dictionary");
        yield return "07".Build(typeof(Dictionary<Task<int>, Task<object>>), x => "task#object-task#int32.dictionary");
    }

    [Theory]
    [MemberData(nameof(GetFormatHostNameData))]
    public void FormatHostName(string testId, Type type, string expectedName)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var name = type.FormatHostName();

        // Assert
        Assert.Equal(expectedName, name);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void FormatHostName_Fails(string testId, Type type, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.FormatHostName());

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    public static IEnumerable<object?[]> GetFormatHostPathData()
    {
        yield return "01".Build(typeof(Type), x => "type");
        yield return "02".Build(typeof(List<object>), x => "list#object");
        yield return "03".Build(typeof(Dictionary<int, object>), x => "dictionary#int32/object");
        yield return "04".Build(typeof(List<Task<int>>), x => "list#task#int32");
        yield return "05".Build(typeof(Dictionary<Task<int>, object>), x => "dictionary#task#int32/object");
        yield return "06".Build(typeof(Dictionary<int, Task<object>>), x => "dictionary#int32/task#object");
        yield return "07".Build(typeof(Dictionary<Task<int>, Task<object>>), x => "dictionary#task#int32/task#object");
    }

    [Theory]
    [MemberData(nameof(GetFormatHostPathData))]
    public void FormatHostPath(string testId, Type type, string expectedName)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var name = type.FormatHostPath();

        // Assert
        Assert.Equal(expectedName, name);
    }

    [Theory]
    [InlineData("01", null, typeof(ArgumentNullException))]
    public void FormatHostPath_Fails(string testId, Type type, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.FormatHostPath());

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("a01", typeof(List<int>), typeof(IEnumerable<>), new[] { typeof(int) })]
    [InlineData("a02", typeof(List<int>), typeof(IList<>), new[] { typeof(int) })]
    [InlineData("a03", typeof(Dictionary<int, object>), typeof(IEnumerable<>), new[] { typeof(KeyValuePair<int, object>) })]
    [InlineData("a04", typeof(Dictionary<int, object>), typeof(IDictionary<,>), new[] { typeof(int), typeof(object) })]
    [InlineData("b01", typeof(List<int>), typeof(IAsyncEnumerable<>), null)]
    [InlineData("b02", typeof(List<int>), typeof(IDictionary<,>), null)]
    [InlineData("b03", typeof(Dictionary<int, object>), typeof(IAsyncEnumerable<>), null)]
    [InlineData("b04", typeof(Dictionary<int, object>), typeof(ILookup<,>), null)]
    public void GetGenericInterface(string testId, Type type, Type interfaceType, Type[] argumentTypes)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var resultType = type.GetGenericInterface(interfaceType);

        // Assert
        if (argumentTypes is not null)
            Assert.Equal(interfaceType.MakeGenericType(argumentTypes), resultType);
        else
            Assert.Null(resultType);
    }

    [Theory]
    [InlineData("01", null, typeof(IEnumerable<>), typeof(ArgumentNullException))]
    [InlineData("02", typeof(List<int>), null, typeof(ArgumentNullException))]
    [InlineData("03", typeof(List<int>), typeof(IEnumerable), typeof(ArgumentException))]
    [InlineData("04", typeof(List<int>), typeof(IEnumerable<int>), typeof(ArgumentException))]
    public void GetGenericInterface_Fails(string testId, Type type, Type interfaceType, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.GetGenericInterface(interfaceType));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }

    [Theory]
    [InlineData("a01", typeof(List<int>), typeof(IEnumerable<>), new[] { typeof(int) }, true)]
    [InlineData("a02", typeof(List<int>), typeof(IList<>), new[] { typeof(int) }, true)]
    [InlineData("a03", typeof(Dictionary<int, object>), typeof(IEnumerable<>), new[] { typeof(KeyValuePair<int, object>) }, true)]
    [InlineData("a04", typeof(Dictionary<int, object>), typeof(IDictionary<,>), new[] { typeof(int), typeof(object) }, true)]
    [InlineData("b01", typeof(List<int>), typeof(IAsyncEnumerable<>), new[] { typeof(int) }, false)]
    [InlineData("b02", typeof(List<int>), typeof(IDictionary<,>), new[] { typeof(int), typeof(object) }, false)]
    [InlineData("b03", typeof(Dictionary<int, object>), typeof(IAsyncEnumerable<>), new[] { typeof(KeyValuePair<int, object>) }, false)]
    [InlineData("b04", typeof(Dictionary<int, object>), typeof(ILookup<,>), new[] { typeof(int), typeof(object) }, false)]
    public void HasGenericInterface(string testId, Type type, Type interfaceType, Type[] argumentTypes, bool expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var result = type.HasGenericInterface(interfaceType, argumentTypes);

        // Assert
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("01", null, typeof(IEnumerable<>), new[] { typeof(int) }, typeof(ArgumentNullException))]
    [InlineData("02", typeof(List<int>), null, new[] { typeof(int) }, typeof(ArgumentNullException))]
    [InlineData("03", typeof(List<int>), typeof(IEnumerable), new[] { typeof(int) }, typeof(ArgumentException))]
    [InlineData("04", typeof(List<int>), typeof(IEnumerable<int>), new[] { typeof(int) }, typeof(ArgumentException))]
    [InlineData("05", typeof(List<int>), typeof(IEnumerable<int>), new[] { typeof(int), typeof(object) }, typeof(ArgumentException))]
    public void HasGenericInterface_Fails(string testId, Type type, Type interfaceType, Type[] argumentTypes, Type exceptionType)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var exception = Assert.Throws(exceptionType, () => type.HasGenericInterface(interfaceType, argumentTypes));

        // Assert
        Assert.IsAssignableFrom(exceptionType, exception);
    }
}