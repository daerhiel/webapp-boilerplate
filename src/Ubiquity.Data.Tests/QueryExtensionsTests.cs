using System.Diagnostics;
using System.Linq.Expressions;
using System.Reflection;

namespace Ubiquity.Data.Tests;

public class QueryExtensionsTests
{
    private static Expression<Func<int, bool>> By2 { get; } = x => x % 2 == 0;
    private static Expression<Func<int, bool>> By3 { get; } = x => x % 3 == 0;

    protected ITestOutputHelper Output { get; }

    public QueryExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    private static Expression<Func<int, bool>>? GetPredicate(string x) => x is not null ? typeof(QueryExtensionsTests)
        .GetProperty(x, BindingFlags.Static | BindingFlags.NonPublic)?
        .GetValue(null) as Expression<Func<int, bool>> ?? throw new ArgumentNullException(nameof(x)) : null;

    [Theory]
    [InlineData("0", 0, 13, new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 })]
    [InlineData("1", 0, 13, new int[] { 0, 3, 6, 9, 12 }, nameof(By3))]
    [InlineData("2", 0, 13, new int[] { 0, 3, 6, 9, 12 }, nameof(By3), null)]
    [InlineData("3", 0, 13, new int[] { 0, 6, 12 }, nameof(By2), nameof(By3))]
    [InlineData("4", 0, 13, new int[] { 0, 6, 12 }, nameof(By3), nameof(By2))]
    public void Where(string id, int start, int count, int[] expected, params string[] names)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        var sequence = Enumerable.Range(start, count).AsQueryable();
        var predicates = names.Select(GetPredicate).ToArray();

        var actual = sequence.Where(predicates);

        Assert.Equal(expected, actual);
    }
}