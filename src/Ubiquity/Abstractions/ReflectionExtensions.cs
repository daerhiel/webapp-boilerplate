using System.Reflection;
using System.Text;

namespace Ubiquity.Abstractions;

/// <summary>
/// Represents the extension method container class for the <see cref="MemberInfo"/> extensions.
/// </summary>
public static partial class ReflectionExtensions
{
    /// <summary>
    /// Formats the generic type name stripping the generic arguments component from it.
    /// </summary>
    /// <param name="type">The type which name should be formatted.</param>
    /// <returns>The type name formatted.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> is null.</exception>
    public static string FormatName(this Type type)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));

        if (type.Name is var name && name.LastIndexOf('`') is var index && index > 0)
            return name[..index];
        else
            return name;
    }

    /// <summary>
    /// Formats the generic type name including the generic arguments component recursively.
    /// </summary>
    /// <param name="type">The type which name should be formatted.</param>
    /// <returns>The type name formatted.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> is null.</exception>
    public static string FormatFullName(this Type type)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));

        if (type.IsGenericType && type.GetGenericTypeDefinition() is { Name: var name } && type.GetGenericArguments() is var args && name.IndexOf('`', StringComparison.Ordinal) is var index && index > 0)
            return new StringBuilder(name.Length + args.Length * 10)
                .Append(name, 0, index)
                .Append('[')
                .AppendJoin(',', args.Select(FormatFullName))
                .Append(']').ToString();
        else
            return type.Name;
    }

    /// <summary>
    /// Formats the generic host name including the generic arguments component recursively.
    /// </summary>
    /// <param name="type">The type which name should be formatted.</param>
    /// <returns>The host name formatted.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> is null.</exception>
    public static string FormatHostName(this Type type)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));

        if (type.IsGenericType && type.GetGenericTypeDefinition() is { Name: var name } && type.GetGenericArguments() is var args)
            return new StringBuilder(name.Length + args.Length * 10)
                .AppendJoin('-', args.Reverse().Select(FormatHostPath)).Append('.')
                .Append(name.ToLowerInvariant(), 0, name.IndexOf('`', StringComparison.Ordinal)).ToString();
        else
            return type.Name.ToLowerInvariant();
    }

    /// <summary>
    /// Formats the generic host path including the generic arguments component recursively.
    /// </summary>
    /// <param name="type">The type which name should be formatted.</param>
    /// <returns>The host path formatted.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> is null.</exception>
    public static string FormatHostPath(this Type type)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));

        if (type.IsGenericType && type.GetGenericTypeDefinition() is { Name: var name } && type.GetGenericArguments() is var args)
            return new StringBuilder(name.Length + args.Length * 10)
                .Append(name.ToLowerInvariant(), 0, name.IndexOf('`', StringComparison.Ordinal))
                .Append('#').AppendJoin('/', args.Select(FormatHostPath))
                .ToString();
        else
            return type.Name.ToLowerInvariant();
    }

    /// <summary>
    /// Gets the first available interface implemented by the specified <paramref name="type"/> matching the generic interface type definition.
    /// </summary>
    /// <param name="type">The type to match the implemented interface at.</param>
    /// <param name="interfaceType">The generic interface type definition to match.</param>
    /// <returns>The generic interface type if match is successful; otherwise, null.</returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> or <paramref name="interfaceType"/> is null.</exception>
    /// <exception cref="ArgumentException">When <paramref name="interfaceType"/> is not a generic type definition.</exception>
    public static Type? GetGenericInterface(this Type type, Type interfaceType)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));
        if (interfaceType is null)
            throw new ArgumentNullException(nameof(interfaceType));
        if (!interfaceType.IsGenericType || !interfaceType.IsGenericTypeDefinition)
            throw new ArgumentException($"The generic interface type is expected: {interfaceType}.", nameof(interfaceType));

        return type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == interfaceType);
    }

    /// <summary>
    /// Checks if the specified <paramref name="type"/> implements the generic interface type given a type devinition and arguments.
    /// </summary>
    /// <param name="type">The type to check the implemented interface at.</param>
    /// <param name="interfaceType">The generic interface type definition to match.</param>
    /// <param name="argumenTypes">The sequence of generic arguments to build the interface type with.</param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException">When <paramref name="type"/> or <paramref name="interfaceType"/> is null.</exception>
    /// <exception cref="ArgumentException">When <paramref name="interfaceType"/> is not a generic type definition.</exception>
    public static bool HasGenericInterface(this Type type, Type interfaceType, params Type[] argumenTypes)
    {
        if (type is null)
            throw new ArgumentNullException(nameof(type));
        if (interfaceType is null)
            throw new ArgumentNullException(nameof(interfaceType));
        if (!interfaceType.IsGenericType || !interfaceType.IsGenericTypeDefinition)
            throw new ArgumentException($"The generic interface type is expected: {interfaceType}.", nameof(interfaceType));

        interfaceType = interfaceType.MakeGenericType(argumenTypes);

        return type.GetInterfaces().Any(x => interfaceType.IsAssignableFrom(x));
    }
}