using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;

namespace ConceptBed.OpenData;

/// <summary>
/// Represents the extension method container class for the <see cref="OpenData"/> extensions.
/// </summary>
public static partial class ODataResultSetExtensions
{
    /// <summary>
    /// Asynchronously creates a <see cref="ODataResultSet{TEntity}"/> from an <see cref="IQueryable{TEntity}"/> by enumerating it asynchronously.
    /// </summary>
    /// <typeparam name="TEntity">The type of an entity.</typeparam>
    /// <param name="sequence">The <see cref="IQueryable{TEntity}"/> entity sequence to enumerate.</param>
    /// <param name="options">The composite OData query options to get the query parameters from.</param>
    /// <param name="settings">The settings to use during query composition.</param>
    /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
    /// <returns>The OData entity result set created.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="sequence"/>, <paramref name="options"/> or <paramref name="settings"/> is null.</exception>
    /// <exception cref="OperationCanceledException">If the <see cref="CancellationToken"/> is canceled.</exception>
    public static async Task<ODataResultSet<TEntity>> ToResultSetAsync<TEntity>(this IQueryable<TEntity> sequence, ODataQueryOptions<TEntity> options, ODataQuerySettings settings, CancellationToken cancellationToken = default)
    {
        if (sequence is null)
            throw new ArgumentNullException(nameof(sequence));
        if (options is null)
            throw new ArgumentNullException(nameof(options));
        if (settings is null)
            throw new ArgumentNullException(nameof(settings));

        var filtered = sequence;
        var nextLink = null as Uri;
        if (options.Context.DefaultQuerySettings.EnableFilter && options.Filter is FilterQueryOption filter)
            sequence = filtered = (IQueryable<TEntity>)filter.ApplyTo(sequence, settings);
        //if (options.Context.DefaultQuerySettings.EnableExpand && options.SelectExpand is SelectExpandQueryOption selectExpand)
            //sequence = (IQueryable<TEntity>)selectExpand.ApplyTo(sequence, settings);
        if (options.Context.DefaultQuerySettings.EnableOrderBy && options.OrderBy is OrderByQueryOption orderBy)
            sequence = orderBy.ApplyTo(sequence, settings);

        if (options.Context.DefaultQuerySettings.EnableSkipToken)
        {
            if (options.Context.DefaultQuerySettings.EnableSkipToken && options.Skip is SkipQueryOption skip)
                sequence = skip.ApplyTo(sequence, settings);

            if (options.Top is TopQueryOption top)
            {
                sequence = top.ApplyTo(sequence, settings);
                nextLink = options.Request.GetNextPageLink(top.Value, null, null);
            }
            else if (settings.PageSize is int pageSize)
            {
                sequence = sequence.Take(pageSize);
                nextLink = options.Request.GetNextPageLink(pageSize, null, null);
            }
        }

        return new ODataResultSet<TEntity>
        {
            Offset = options.Skip?.Value ?? 0,
            Count = await filtered.LongCountAsync(cancellationToken: cancellationToken),
            Elements = await sequence.ToListAsync(cancellationToken: cancellationToken),
            NextLink = nextLink
        };
    }
}
