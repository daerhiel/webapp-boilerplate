using Microsoft.EntityFrameworkCore;
using System.Collections;

namespace Ubiquity.Data.Tests.Engine;

/// <inheritdoc/>
public class StaticDbContext : DbContext
{
    public void Setup<TEntity>(IEnumerable<TEntity> entities)
        where TEntity : class
    {
        if (entities is null)
            throw new ArgumentNullException(nameof(entities));

        Set<TEntity>().AddRange(entities);
        SaveChanges();
    }

    public void Setup<TEntity>(params TEntity[] entities)
        where TEntity : class
    {
        if (entities is null)
            throw new ArgumentNullException(nameof(entities));

        Set<TEntity>().AddRange(entities);
        SaveChanges();
    }
}