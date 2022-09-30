using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Ubiquity.Data;

/// <summary>
/// Represents the extension method container class for the <see cref="Expression"/> extensions.
/// </summary>
public static partial class ParserExtensions
{
    /// <summary>
    /// Gets the predicate lambda expression for the specified filter query expression.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="input">The input filter query expression to parse and compile.</param>
    /// <param name="factory">The factory to use for a default predicate lambda expression value.</param>
    /// <returns>The predicate lambda expression compiled.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="factory"/> is null.</exception>
    public static Expression<Func<T, bool>> GetPredicate<T>(this string? input, Func<Expression<Func<T, bool>>> factory)
    {
        if (factory is null)
            throw new ArgumentNullException(nameof(factory));

        return factory.Invoke();
    }

    /// <summary>
    /// Gets the <see cref="IQueryable"/> projection delegate for the specified navigation property set expression.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="input">The input navigation property set expression to parse and compile.</param>
    /// <param name="factory">The factory to use for a default <see cref="IQueryable"/> projection delegate value.</param>
    /// <returns>The <see cref="IQueryable"/> projection delegate compiled.</returns>
    public static Func<IQueryable<T>, IIncludableQueryable<T, object>>? GetIncludes<T>(this string? input, Func<Func<IQueryable<T>, IIncludableQueryable<T, object>>?> factory)
    {
        return factory?.Invoke();
    }

    /// <summary>
    /// Gets the <see cref="IQueryable"/> projection delegate for the specified property set expression.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="input">The input property set expression to parse and compile.</param>
    /// <param name="factory">The factory to use for a default <see cref="IQueryable"/> projection delegate value.</param>
    /// <returns>The <see cref="IQueryable"/> projection delegate compiled.</returns>
    public static Func<IQueryable<T>, IOrderedQueryable<T>>? GetOrderBy<T>(this string? input, Func<Func<IQueryable<T>, IOrderedQueryable<T>>>? factory)
    {
        return factory?.Invoke();
    }
}