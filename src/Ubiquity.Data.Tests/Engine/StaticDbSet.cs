using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Collections;
using System.Linq.Expressions;

namespace Ubiquity.Data.Tests.Engine;

/// <summary>
/// A <see cref="StaticDbSet{TEntity}"/> can be used to query and save instances of <typeparamref name="TEntity" />. 
/// LINQ queries against a <see cref="StaticDbSet{TEntity}"/> will be translated into queries against the static data in memory.
/// </summary>
/// <typeparam name="TEntity">The type of entity being operated on by this set.</typeparam>
public class StaticDbSet<TEntity> : DbSet<TEntity>, IQueryable<TEntity>, IAsyncEnumerable<TEntity>
    where TEntity : class
{
    private readonly IQueryable<TEntity> _queryable;
    private readonly DbContext _context;
    private IEntityType? _entityType;

    /// <inheritdoc/>
    Type IQueryable.ElementType => _queryable.ElementType;

    /// <inheritdoc/>
    Expression IQueryable.Expression => _queryable.Expression;

    /// <inheritdoc/>
    IQueryProvider IQueryable.Provider => new AsyncQueryProvider<TEntity>(_queryable.Provider);

    /// <inheritdoc/>
    public override IEntityType EntityType
    {
        get
        {
            if (_entityType is not null)
                return _entityType;

            var entityType = _context.Model.FindEntityType(typeof(TEntity));

            if (entityType is null)
                throw new InvalidOperationException(CoreStrings.InvalidSetType(typeof(TEntity).ShortDisplayName()));

            if (entityType.IsOwned())
            {
                throw new InvalidOperationException(CoreStrings.InvalidSetTypeOwned(
                    entityType.DisplayName(), 
                    entityType.FindOwnership()!.PrincipalEntityType.DisplayName()));
            }
            if (entityType.ClrType != typeof(TEntity))
            {
                throw new InvalidOperationException(CoreStrings.DbSetIncorrectGenericType(
                    entityType.ShortName(), 
                    entityType.ClrType.ShortDisplayName(), 
                    typeof(TEntity).ShortDisplayName()));
            }

            return _entityType = entityType;
        }
    }

    /// <summary>
    /// Initializes the new instance of a <see cref="StaticDbSet{TEntity}"/>
    /// </summary>
    /// <param name="data">The data seource to use as a static container for <see cref="StaticDbSet{TEntity}"/>.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="context"/> or <paramref name="data"/> is null.</exception>
    public StaticDbSet(DbContext context, IEnumerable<TEntity> data)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));

        if (data is null)
            throw new ArgumentNullException(nameof(data));

        _queryable = data.AsQueryable();
    }

    /// <inheritdoc/>
    IEnumerator IEnumerable.GetEnumerator() =>
        _queryable.GetEnumerator();

    /// <inheritdoc/>
    IEnumerator<TEntity> IEnumerable<TEntity>.GetEnumerator() =>
        _queryable.GetEnumerator();

    /// <inheritdoc/>
    IAsyncEnumerator<TEntity> IAsyncEnumerable<TEntity>.GetAsyncEnumerator(CancellationToken cancellationToken) =>
        new AsyncEnumerator<TEntity>(_queryable.GetEnumerator());
}