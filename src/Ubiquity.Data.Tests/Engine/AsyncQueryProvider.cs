using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Ubiquity.Data.Tests.Engine;

/// <summary>
/// Represents the <see cref="AsyncQueryProvider{T}"/> that executes queries asynchronously on a dataset.
/// </summary>
/// <typeparam name="T">The type of a dataset element.</typeparam>
public class AsyncQueryProvider<T> : IAsyncQueryProvider
{
    private readonly IQueryProvider _inner;

    /// <summary>
    /// Initializes the new instance of a <see cref="AsyncQueryProvider{T}"/>.
    /// </summary>
    /// <param name="inner">The inner query provider to setup the async provider for.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="inner"/> is null.</exception>
    public AsyncQueryProvider(IQueryProvider inner) =>
        _inner = inner ?? throw new ArgumentNullException(nameof(inner));

    /// <inheritdoc/>
    public IQueryable CreateQuery(Expression expression) =>
        new AsyncEnumerableQuery<T>(expression);

    /// <inheritdoc/>
    public IQueryable<TElement> CreateQuery<TElement>(Expression expression) =>
        new AsyncEnumerableQuery<TElement>(expression);

    /// <inheritdoc/>
    public object? Execute(Expression expression) =>
        _inner.Execute(expression);

    /// <inheritdoc/>
    public TResult Execute<TResult>(Expression expression) =>
        _inner.Execute<TResult>(expression);

    /// <inheritdoc/>
    public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken = default) =>
        _inner.Execute<TResult>(expression);
}