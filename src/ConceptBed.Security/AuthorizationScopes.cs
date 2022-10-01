using System.ComponentModel;
using System.Reflection;

namespace ConceptBed.Security;

/// <summary>
/// Represents a static container for the authorization scope names configured in the application.
/// </summary>
public static class AuthorizationScopes
{
    /// <summary>
    /// The name of a scope that enables the user impersonation.
    /// </summary>
    [Description("Allows to act on behalf of a user.")]
    public const string UserImpersonation = "user_impersonation";

    /// <summary>
    /// Gets the indexed scope description dictionary for documenting the scope structure.
    /// </summary>
    /// <returns>The indexed scope description dictionary constructed.</returns>
    public static IDictionary<string, string?> GetScopes(string audience) => typeof(AuthorizationScopes)
        .GetFields()
        .Select(x => (Name: x.GetValue(null) as string, x.GetCustomAttribute<DescriptionAttribute>()?.Description))
        .ToDictionary(x => $"{audience}/{x.Name}", x => x.Description ?? x.Name);
}