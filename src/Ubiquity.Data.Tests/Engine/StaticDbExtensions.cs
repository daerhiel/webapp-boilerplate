namespace Ubiquity.Data.Tests.Engine;

public static partial class StaticDbExtensions
{
    public static TContext Setup<TContext, TEntity>(this TContext context, IEnumerable<TEntity> entities)
        where TContext : StaticDbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Configure(entities);
        return context;
    }

    public static TContext Setup<TContext, TEntity>(this TContext context, params TEntity[] entities)
        where TContext : StaticDbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Configure(entities);
        return context;
    }
}