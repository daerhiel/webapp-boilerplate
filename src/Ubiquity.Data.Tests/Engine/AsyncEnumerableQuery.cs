using System.Linq.Expressions;

namespace Ubiquity.Data.Tests.Engine;

/// <inheritdoc/>
public class AsyncEnumerableQuery<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
{
    /// <inheritdoc/>
    IQueryProvider IQueryable.Provider => new AsyncQueryProvider<T>(this);

    /// <inheritdoc/>
    public AsyncEnumerableQuery(IEnumerable<T> enumerable) : base(enumerable)
    {
    }

    /// <inheritdoc/>
    public AsyncEnumerableQuery(Expression expression) : base(expression)
    {
    }

    /// <inheritdoc/>
    public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default) =>
        new AsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
}
