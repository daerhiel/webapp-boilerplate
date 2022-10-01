using Arch.EntityFrameworkCore.UnitOfWork;
using Arch.EntityFrameworkCore.UnitOfWork.Collections;
using ConceptBed.Data.Models;
using Microsoft.EntityFrameworkCore;
using Nito.AsyncEx;
using System.Linq.Expressions;
using Ubiquity.Abstractions;
using Ubiquity.Data;

namespace ConceptBed.Data;

/// <inheritdoc/>
public class ConceptUnitOfWork<TContext> : UnitOfWork<TContext>, IUnitOfWorkContext
    where TContext: ConceptContext
{
    private readonly AsyncReaderWriterLock _lock = new();

    private static readonly DisposableFallback _completion = new();
    private static readonly AwaitableDisposable<IDisposable> _unlocked = new(Task.FromResult<IDisposable>(_completion));

    /// <summary>
    /// The database context provided by the unit of work.
    /// </summary>
    DbContext IUnitOfWorkContext.DbContext => DbContext;

    /// <inheritdoc/>
    public ConceptUnitOfWork(TContext context)
        : base(context)
    {
    }

    /// <summary>
    /// Locks the current <typeparamref name="TContext"/> for using with the current thread if it's required by the caller.
    /// </summary>
    /// <param name="threadLock">True if the lock is required; otherwisem, false.</param>
    /// <returns>The disposable object that represents the lock.</returns>
    public Task<IDisposable> LockWhenRequiredAsync(bool threadLock = false) => threadLock.CreateIf(_lock.WriterLockAsync, _unlocked);

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public async Task<WeatherForecast?> GetForecastAsync(Expression<Func<WeatherForecast, bool>> predicate, bool disableTracking = true, bool threadLock = false)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        using (await threadLock.CreateIf(_lock.WriterLockAsync, _unlocked))
        {
            return await DbContext.Forecasts
                .Where(predicate)//.Include(x => x.ManagedBy)
                .AsTracking(disableTracking ? QueryTrackingBehavior.NoTracking : QueryTrackingBehavior.TrackAll)
                .FirstOrDefaultAsync().ConfigureAwait(false);
        }
    }

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public async Task<IList<WeatherForecast>> GetForecastsAllAsync(Expression<Func<WeatherForecast, bool>> predicate, bool disableTracking = true, bool threadLock = false)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        using (await threadLock.CreateIf(_lock.WriterLockAsync, _unlocked))
        {
            return await DbContext.Forecasts
                .Where(predicate)//.Include(x => x.ManagedBy)
                .AsTracking(disableTracking ? QueryTrackingBehavior.NoTracking : QueryTrackingBehavior.TrackAll)
                .ToListAsync().ConfigureAwait(false);
        }
    }

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public async Task<IPagedList<WeatherForecast>> GetForecastsAsync(Expression<Func<WeatherForecast, bool>> predicate, Func<IQueryable<WeatherForecast>, IOrderedQueryable<WeatherForecast>>? orderBy = null, int pageIndex = 0, int pageSize = 20, bool disableTracking = true, bool threadLock = false)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        using (await threadLock.CreateIf(_lock.WriterLockAsync, _unlocked))
        {
            return await GetRepository<WeatherForecast>()
                .GetPagedListAsync(predicate: predicate,
                    //include: query => query.Include(x => x.ManagedBy),
                    orderBy: orderBy, pageIndex: pageIndex, pageSize: pageSize, disableTracking: disableTracking)
                .ConfigureAwait(false);
        }
    }

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    protected async Task<IList<WeatherForecast>> GetForecastsAsync(WeatherForecast forecast)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
    {
        return await DbContext.Forecasts
            .Where(WeatherForecast.IsMatching(forecast)).OrderBy(x => x.Id)
            .AsTracking(QueryTrackingBehavior.TrackAll)
            .ToListAsync().ConfigureAwait(false);
    }
}