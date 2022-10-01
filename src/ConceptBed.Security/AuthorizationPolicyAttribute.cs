namespace ConceptBed.Security;

/// <summary>
/// Represents an authorization policy <see cref="Attribute"/> that associates the configuration object with an authorization policy.
/// </summary>
[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = false)]
public class AuthorizationPolicyAttribute : Attribute
{
    /// <summary>
    /// The name of authorization policy associated with the current configuration object.
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// Initializes the new instance of an authorization policy <see cref="Attribute"/>.
    /// </summary>
    /// <param name="name">The name of authorization policy to associate the current configuration object with.</param>
    public AuthorizationPolicyAttribute(string name) => Name = name ?? throw new ArgumentNullException(nameof(name));
}