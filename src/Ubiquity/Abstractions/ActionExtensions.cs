namespace Ubiquity.Abstractions;

/// <summary>
/// Represents the extension method container class for the <see cref="Action"/> extensions.
/// </summary>
public static partial class ActionExtensions
{
    /// <summary>
    /// Applies the specified action delegate to an object or value.
    /// </summary>
    /// <typeparam name="T">The type of an object or value.</typeparam>
    /// <param name="source">The object or value to apply the action to.</param>
    /// <param name="action">The action delegate to apply to an object or value.</param>
    /// <returns>The object or value for the fluent calls.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="action"/> is null.</exception>
    public static T Apply<T>(this T source, Action<T> action)
        where T : class
    {
        if (action is null)
            throw new ArgumentNullException(nameof(action));

        action(source);
        return source;
    }

    /// <summary>
    /// Applies the specified action delegate to an object or value conditionally.
    /// </summary>
    /// <typeparam name="T">The type of an object or value.</typeparam>
    /// <param name="source">The object or value to apply the action to.</param>
    /// <param name="condition">True to apply the action to an object or value; otherwise, false.</param>
    /// <param name="action">The action delegate to apply to an object or value.</param>
    /// <returns>The object or value for the fluent calls.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="action"/> is null.</exception>
    public static T ApplyIf<T>(this T source, bool condition, Action<T> action)
        where T : class
    {
        if (action is null)
            throw new ArgumentNullException(nameof(action));

        if (condition)
            action(source);
        return source;
    }

    /// <summary>
    /// Applies the specified action delegate to sequence of objects or values.
    /// </summary>
    /// <typeparam name="T">The type of an object or value.</typeparam>
    /// <param name="source">The sequence of objects or values to apply the action to.</param>
    /// <param name="action">The action delegate to apply to an object or value.</param>
    /// <returns>The object or value for the fluent calls.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="action"/> is null.</exception>
    public static IEnumerable<T> ApplyAll<T>(this IEnumerable<T> source, Action<T> action)
    {
        if (action is null)
            throw new ArgumentNullException(nameof(action));

        foreach (var value in source)
            action(value);
        return source;
    }

    /// <summary>
    /// Creates the new object or value from a factory or uses the fallback value conditionally.
    /// </summary>
    /// <typeparam name="T">The type of an object or value.</typeparam>
    /// <param name="condition">True to create an object or value from factory; otherwise, false.</param>
    /// <param name="factory">The factory delegate to that creates an object or value.</param>
    /// <param name="fallback">The fallback object or value.</param>
    /// <returns>The object or value created; otherwise, fallback one.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="factory"/> is null.</exception>
    public static T? CreateIf<T>(this bool condition, Func<T> factory, T? fallback = default)
    {
        if (factory is null)
            throw new ArgumentNullException(nameof(factory));

        return condition ? factory() : fallback;
    }
}