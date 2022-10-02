namespace Ubiquity.Tests.Xunit;

public static partial class XunitExtensions
{
    public static object?[] Build<T1>(this string testId, T1 value1, Func<T1, object?> projector) => new object?[]
    {
        testId,
        value1,
        projector.Invoke(value1)
    };
}