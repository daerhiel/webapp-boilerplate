using System.Linq.Expressions;

namespace Ubiquity.Abstractions;

/// <summary>
/// Represents the extension method container class for the <see cref="Expression"/> extensions.
/// </summary>
public static partial class ExpressionExtensions
{
    /// <summary>
    /// Creates the lambda expression from the specified <typeparamref name="R"/> value if it's not null.
    /// </summary>
    /// <typeparam name="T">The type of an object.</typeparam>
    /// <typeparam name="R">The type of a value.</typeparam>
    /// <param name="value">The value to validate.</param>
    /// <param name="factory">The factory that creates the lambda expression.</param>
    /// <returns>The lambda expression created if the value meets the criteria; otherwise, null.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="factory"/> is null.</exception>
    public static Expression<Func<T, bool>>? ToPredicate<T, R>(this R? value, Func<R, Expression<Func<T, bool>>> factory)
    {
        if (factory is null)
            throw new ArgumentNullException(nameof(factory));

        if (value is null)
            return null;
        else
            return factory(value);
    }

    /// <summary>
    /// Creates the lambda expression from the specified <see cref="string"/> value if it's not null or whitespace.
    /// </summary>
    /// <typeparam name="T">The type of an object.</typeparam>
    /// <param name="value">The value to validate.</param>
    /// <param name="factory">The factory that creates the lambda expression.</param>
    /// <returns>The lambda expression created if the value meets the criteria; otherwise, null.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="factory"/> is null.</exception>
    public static Expression<Func<T, bool>>? ToPredicate<T>(this string? value, Func<string, Expression<Func<T, bool>>> factory)
    {
        if (factory is null)
            throw new ArgumentNullException(nameof(factory));

        if (string.IsNullOrWhiteSpace(value))
            return null;
        else
            return factory(value);
    }
}