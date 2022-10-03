using Microsoft.EntityFrameworkCore;
using Moq;

namespace Ubiquity.Data.Tests.Engine;

/// <summary>
/// Represents the extension method container class for the <see cref="DbSet{TEntity}"/> mock extensions.
/// </summary>
public static partial class DbSetExtensions
{
    /// <summary>
    /// Sets up the testing framework for <see cref="DbSet{TEntity}"/> for queryable tests.
    /// </summary>
    /// <typeparam name="TDbSet">The type of a set to setup the testing framework for.</typeparam>
    /// <typeparam name="TEntity">The type of entity being operated on by the set.</typeparam>
    /// <param name="mock">The mock for <see cref="DbSet{TEntity}"/>.</param>
    /// <param name="data">The <see cref="IQueryable{TEntity}"/> dataset to setup for testing.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="data"/> or <paramref name="mock"/> is null.</exception>
    public static void Setup<TDbSet, TEntity>(this Mock<TDbSet> mock, IQueryable<TEntity> data)
        where TDbSet : DbSet<TEntity>
        where TEntity : class
    {
        if (mock is null)
            throw new ArgumentNullException(nameof(mock));
        if (data is null)
            throw new ArgumentNullException(nameof(data));

        mock.As<IAsyncEnumerable<TEntity>>()
            .Setup(m => m.GetAsyncEnumerator(default))
            .Returns(new AsyncEnumerator<TEntity>(data.GetEnumerator()));

        mock.As<IQueryable<TEntity>>()
            .Setup(m => m.Provider)
            .Returns(new AsyncQueryProvider<TEntity>(data.Provider));

        mock.As<IQueryable<TEntity>>()
            .Setup(m => m.Expression)
            .Returns(data.Expression);

        mock.As<IQueryable<TEntity>>()
            .Setup(m => m.ElementType)
            .Returns(data.ElementType);

        mock.As<IQueryable<TEntity>>()
            .Setup(m => m.GetEnumerator())
            .Returns(data.GetEnumerator());
    }
}