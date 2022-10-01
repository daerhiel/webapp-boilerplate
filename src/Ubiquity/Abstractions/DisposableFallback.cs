namespace Ubiquity.Abstractions;

/// <summary>
/// Represents the disposable object fallback that is not required to release anything.
/// </summary>
public class DisposableFallback : IDisposable
{
    /// <inheritdoc/>
    public void Dispose() => GC.SuppressFinalize(this);
}