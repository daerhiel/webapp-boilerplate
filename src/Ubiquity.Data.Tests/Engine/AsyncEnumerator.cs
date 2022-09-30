namespace Ubiquity.Data.Tests.Engine;

/// <summary>
/// Represents the <see cref="AsyncEnumerator{T}"/> Provides the asynchronous iteration over a static enumerable dataset.
/// </summary>
/// <typeparam name="T">The type of a dataset element.</typeparam>
public class AsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _inner;

    /// <inheritdoc/>
    public T Current => _inner.Current;

    /// <summary>
    /// Initializes the new instance of a <see cref="AsyncEnumerator{T}"/>.
    /// </summary>
    /// <param name="inner">The inner dataset to set up for enumerator.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="inner"/> is null.</exception>
    public AsyncEnumerator(IEnumerator<T> inner) =>
        _inner = inner ?? throw new ArgumentNullException(nameof(inner));

    /// <inheritdoc/>
    public ValueTask<bool> MoveNextAsync() => new(_inner.MoveNext());

    /// <inheritdoc/>
    public ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);
        _inner.Dispose();
        return new();
    }
}