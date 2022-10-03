using Microsoft.EntityFrameworkCore;

namespace Ubiquity.Data;

/// <summary>
/// The extension method container class for the <see cref="DbContext"/> startup definitions.
/// </summary>
public static partial class EntityExtensions
{
    /// <summary>
    /// Stores the range of <typeparamref name="TEntity"/> objects into <see cref="DbContext"/>.
    /// </summary>
    /// <typeparam name="TContext">The type of <see cref="DbContext"/>.</typeparam>
    /// <typeparam name="TEntity">The type of an entity.</typeparam>
    /// <param name="context">The <see cref="DbContext"/> to push the entities into.</param>
    /// <param name="entities">The sequence of <typeparamref name="TEntity"/> instances to push to the current context.</param>
    /// <returns>The <see cref="DbContext"/> the entities pushed into.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="context"/> is null.</exception>
    public static TContext StoreRange<TContext, TEntity>(this TContext context, IEnumerable<TEntity> entities)
        where TContext : DbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Set<TEntity>().AddRange(entities);
        context.SaveChanges();
        return context;
    }

    /// <summary>
    /// Stores the range of <typeparamref name="TEntity"/> objects into <see cref="DbContext"/>.
    /// </summary>
    /// <typeparam name="TContext">The type of <see cref="DbContext"/>.</typeparam>
    /// <typeparam name="TEntity">The type of an entity.</typeparam>
    /// <param name="context">The <see cref="DbContext"/> to push the entities into.</param>
    /// <param name="entities">The sequence of <typeparamref name="TEntity"/> instances to push to the current context.</param>
    /// <returns>The <see cref="DbContext"/> the entities pushed into.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="context"/> is null.</exception>
    public static TContext StoreRange<TContext, TEntity>(this TContext context, params TEntity[] entities)
        where TContext : DbContext
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));

        context.Set<TEntity>().AddRange(entities);
        context.SaveChanges();
        return context;
    }

    /// <summary>
    /// Pushes the entity update to <see cref="DbContext"/> depending on the entry <see cref="EntityState"/>.
    /// </summary>
    /// <typeparam name="TEntity">The type of an entity.</typeparam>
    /// <param name="context">The <see cref="DbContext"/> to push the entity into.</param>
    /// <param name="entity">The <typeparamref name="TEntity"/> instance to push to the current context.</param>
    /// <returns>The <typeparamref name="TEntity"/> updated.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="context"/> or <paramref name="entity"/> is null.</exception>
    /// <exception cref="InvalidOperationException">When <see cref="EntityState"/> is not valid.</exception>
    public static TEntity PushUpdate<TEntity>(this DbContext context, TEntity entity)
        where TEntity : class
    {
        if (context is null)
            throw new ArgumentNullException(nameof(context));
        if (entity is null)
            throw new ArgumentNullException(nameof(entity));

        return context.Entry(entity).State switch
        {
            EntityState.Added or EntityState.Deleted or EntityState.Unchanged => entity,
            EntityState.Detached => context.Add(entity).Entity,
            EntityState.Modified => context.Update(entity).Entity,
            var state => throw new InvalidOperationException($"The entity state is not supported: {state}."),
        };
    }
}