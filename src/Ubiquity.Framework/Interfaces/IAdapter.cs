using Arch.EntityFrameworkCore.UnitOfWork.Collections;

namespace Ubiquity.Framework
{
    /// <summary>
    /// Represents the interface to an adapter that provides access to the <typeparamref name="TEntity"/> objects in a data layer.
    /// </summary>
    /// <typeparam name="TKey">The type of the entity key.</typeparam>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    public interface IAdapter<TKey, TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Gets the top-level queryable for the underlying <typeparamref name="TEntity"/> object set.
        /// </summary>
        /// <returns></returns>
        IQueryable<TEntity> GetQuery();

        /// <summary>
        /// Finds the single <typeparamref name="TEntity"/> matching the unique <typeparamref name="TKey"/> represented by <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The unique <typeparamref name="TEntity"/> identifier that designates the entity object.</param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
        /// <returns>The <typeparamref name="TEntity"/> object matching the identifier if found; otherwise, null.</returns>
        /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
        Task<TEntity> FindAsync(TKey id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets the list of <typeparamref name="TEntity"/> objects matching the filter query expression.
        /// </summary>
        /// <param name="filterBy">The filter query expression to match the <typeparamref name="TEntity"/> object with.</param>
        /// <param name="expandTo">The navigation property set expression to expand the <typeparamref name="TEntity"/> object to.</param>
        /// <param name="orderBy">The property set expression to order the <typeparamref name="TEntity"/> objects by.</param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
        /// <returns>The list of <typeparamref name="TEntity"/> objects returned.</returns>
        /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
        Task<IList<TEntity>> GetAsync(string? filterBy, string? expandTo = null, string? orderBy = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets the paged list of <typeparamref name="TEntity"/> objects matching the filter query expression.
        /// </summary>
        /// <param name="filterBy">The filter query expression to match the <typeparamref name="TEntity"/> object with.</param>
        /// <param name="expandTo">The navigation property set expression to expand the <typeparamref name="TEntity"/> object to.</param>
        /// <param name="orderBy">The property set expression to order the <typeparamref name="TEntity"/> objects by.</param>
        /// <param name="pageIndex">The index of a page.</param>
        /// <param name="pageSize">The size of a page.</param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
        /// <returns>The paged list of <typeparamref name="TEntity"/> objects returned.</returns>
        /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
        Task<IPagedList<TEntity>> GetPageAsync(string? filterBy, string? expandTo = null, string? orderBy = null, int pageIndex = 0, int pageSize = 20, CancellationToken cancellationToken = default);

        /// <summary>
        /// Searches for the <typeparamref name="TEntity"/> objects matching the query search term expression.
        /// </summary>
        /// <param name="query">The query search term expression to match the <typeparamref name="TEntity"/> object with.</param>
        /// <param name="expandTo">The navigation property set expression to expand the <typeparamref name="TEntity"/> object to.</param>
        /// <param name="orderBy">The property set expression to order the <typeparamref name="TEntity"/> objects by.</param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
        /// <returns>The list of <typeparamref name="TEntity"/> objects returned.</returns>
        /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
        Task<IList<TEntity>> SearchAsync(string query, string? expandTo = null, string? orderBy = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Searches and returns the paged list of <typeparamref name="TEntity"/> objects matching the query search term expression.
        /// </summary>
        /// <param name="query">The query search term expression to match the <typeparamref name="TEntity"/> object with.</param>
        /// <param name="expandTo">The navigation property set expression to expand the <typeparamref name="TEntity"/> object to.</param>
        /// <param name="orderBy">The property set expression to order the <typeparamref name="TEntity"/> objects by.</param>
        /// <param name="pageIndex">The index of a page.</param>
        /// <param name="pageSize">The size of a page.</param>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
        /// <returns>The paged list of <typeparamref name="TEntity"/> objects returned.</returns>
        /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
        Task<IPagedList<TEntity>> SearchPageAsync(string query, string? expandTo = null, string? orderBy = null, int pageIndex = 0, int pageSize = 20, CancellationToken cancellationToken = default);
    }
}