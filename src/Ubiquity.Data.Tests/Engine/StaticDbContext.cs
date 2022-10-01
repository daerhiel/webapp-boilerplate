using Microsoft.EntityFrameworkCore;

namespace Ubiquity.Data.Tests.Engine;

/// <inheritdoc/>
public class StaticDbContext : DbContext
{
    public void Configure<TEntity>(IEnumerable<TEntity> entities)
        where TEntity : class
    {
        if (entities is null)
            throw new ArgumentNullException(nameof(entities));

        Set<TEntity>().AddRange(entities);
        SaveChanges();
    }

    public void Configure<TEntity>(params TEntity[] entities)
        where TEntity : class
    {
        if (entities is null)
            throw new ArgumentNullException(nameof(entities));

        Set<TEntity>().AddRange(entities);
        SaveChanges();
    }
}