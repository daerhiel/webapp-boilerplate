namespace ConceptBed.Security;

/// <summary>
/// Represents an authorization scope <see cref="Attribute"/> that associates the configuration object with a set of authorization scopes.
/// </summary>
[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = false)]
public class AuthorizationScopesAttribute : Attribute
{
    /// <summary>
    /// The array of names of authorization scopes associated with the current configuration object.
    /// </summary>
    public string[] Names { get; }

    /// <summary>
    /// Initialzies the new instance of an authorization scope <see cref="Attribute"/>.
    /// </summary>
    /// <param name="names">The array of names of authorization scopes to associate the configuration object with.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="names"/> is null.</exception>
    public AuthorizationScopesAttribute(params string[] names) => Names = names ?? throw new ArgumentNullException(nameof(names));
}