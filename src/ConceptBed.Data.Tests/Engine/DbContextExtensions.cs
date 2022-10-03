using Microsoft.EntityFrameworkCore;

namespace ConceptBed.Data.Tests.Engine;

public static partial class DbContextExtensions
{
    public static TContext Setup<TContext, TEntity>(this TContext context, IEnumerable<TEntity> entities)
        where TContext : DbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Set<TEntity>().AddRange(entities);
        context.SaveChanges();
        return context;
    }

    public static TContext Setup<TContext, TEntity>(this TContext context, params TEntity[] entities)
        where TContext : DbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Set<TEntity>().AddRange(entities);
        context.SaveChanges();
        return context;
    }
}