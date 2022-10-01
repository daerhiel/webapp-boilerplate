using Arch.EntityFrameworkCore.UnitOfWork;
using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;
using Ubiquity.Data;

namespace Ubiquity.Framework;

/// <summary>
/// Represents the adapter that provides access to the <typeparamref name="TEntity"/> objects in a data layer.
/// </summary>
/// <typeparam name="TKey">The type of the entity key.</typeparam>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TUnitOfWork">The type of the unit of work.</typeparam>
public abstract class Adapter<TKey, TEntity, TUnitOfWork> : IAdapter<TKey, TEntity>
    where TEntity : class
    where TUnitOfWork : IUnitOfWork, IUnitOfWorkContext
{
    /// <summary>
    /// The <see cref="UnitOfWork{TContext}"/> associated with the current adapter.
    /// </summary>
    public TUnitOfWork UnitOfWork { get; }

    /// <summary>
    /// Initializes the new instance of adapter to the <typeparamref name="TEntity"/> objects.
    /// </summary>
    /// <param name="unitOfWork">The <see cref="UnitOfWork{TContext}"/> to associate with the current adapter.</param>
    /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
    protected Adapter(TUnitOfWork unitOfWork) => UnitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

    /// <summary>
    /// Gets the default predicate lambda expression used to query the <typeparamref name="TEntity"/> objects.
    /// </summary>
    /// <returns>The predicate lambda expression returned.</returns>
    protected virtual Expression<Func<TEntity, bool>> GetDefaultPredicate() => x => true;

    /// <summary>
    /// Gets the default predicate lambda expression used to query the <typeparamref name="TEntity"/> objects.
    /// </summary>
    /// <param name="query">The query search term expression to match the <typeparamref name="TEntity"/> object with.</param>
    /// <returns>The predicate lambda expression returned.</returns>
    protected abstract Expression<Func<TEntity, bool>> GetSearchPredicate(string query);

    /// <summary>
    /// Gets the default <see cref="IQueryable"/> projection delegate that builds order lambda expression.
    /// </summary>
    /// <returns>The <see cref="IQueryable"/> projection delegate returned.</returns>
    protected abstract Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> GetDefaultOrderBy();

    /// <summary>
    /// Gets the default <see cref="IQueryable"/> projection delegate that builds include lambda expression.
    /// </summary>
    /// <returns>The <see cref="IQueryable"/> projection delegate returned.</returns>
    protected virtual Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? GetDefaultIncludes() => null;

    /// <inheritdoc/>
    public IQueryable<TEntity> GetQuery() => UnitOfWork.DbContext.Set<TEntity>();

    /// <inheritdoc/>
    public async Task<TEntity> FindAsync(TKey id, CancellationToken cancellationToken = default) =>
        await UnitOfWork.GetRepository<TEntity>().FindAsync(new object[] { id! }, cancellationToken: cancellationToken).ConfigureAwait(false);

    /// <inheritdoc/>
    public async Task<IList<TEntity>> GetAsync(string? filterBy, string? expandTo = null, string? orderBy = null, CancellationToken cancellationToken = default)
    {
        var dataset = UnitOfWork.DbContext.Set<TEntity>()
            .Where(filterBy.GetPredicate(GetDefaultPredicate));
        if (expandTo.GetIncludes(GetDefaultIncludes) is Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include)
            dataset = include(dataset);
        if (orderBy.GetOrderBy(GetDefaultOrderBy) is Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> order)
            dataset = order(dataset);
        return await dataset.ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc/>
    public async Task<IPagedList<TEntity>> GetPageAsync(string? filterBy, string? expandTo = null, string? orderBy = null, int pageIndex = 0, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        return await UnitOfWork.GetRepository<TEntity>().GetPagedListAsync(
            predicate: filterBy.GetPredicate(GetDefaultPredicate),
            include: expandTo.GetIncludes(GetDefaultIncludes),
            orderBy: orderBy.GetOrderBy(GetDefaultOrderBy),
            pageIndex: pageIndex, pageSize: pageSize, cancellationToken: cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc/>
    public async Task<IList<TEntity>> SearchAsync(string query, string? expandTo = null, string? orderBy = null, CancellationToken cancellationToken = default)
    {
        var dataset = UnitOfWork.DbContext.Set<TEntity>()
            .Where(GetSearchPredicate(query));
        if (expandTo.GetIncludes(GetDefaultIncludes) is Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include)
            dataset = include(dataset);
        if (orderBy.GetOrderBy(GetDefaultOrderBy) is Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> order)
            dataset = order(dataset);
        return await dataset.ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc/>
    public async Task<IPagedList<TEntity>> SearchPageAsync(string query, string? expandTo = null, string? orderBy = null, int pageIndex = 0, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        return await UnitOfWork.GetRepository<TEntity>().GetPagedListAsync(
            predicate: GetSearchPredicate(query),
            include: expandTo.GetIncludes(GetDefaultIncludes),
            orderBy: orderBy.GetOrderBy(GetDefaultOrderBy),
            pageIndex: pageIndex, pageSize: pageSize, cancellationToken: cancellationToken).ConfigureAwait(false);
    }
}