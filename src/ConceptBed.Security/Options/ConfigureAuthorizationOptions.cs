using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;

namespace ConceptBed.Security.Options;

/// <summary>
/// Represents an <see cref="IConfigureOptions{AuthorizationOptions}"/> configurator object that sets up the respective service.
/// </summary>
public class ConfigureAuthorizationOptions : IConfigureOptions<AuthorizationOptions>
{
    /// <inheritdoc/>
    public void Configure(AuthorizationOptions options)
    {
        foreach (var policyName in AuthorizationPolicies.Get())
        {
            var scopeNames = AuthorizationRequirements.GetScopes(policyName).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var requirements = AuthorizationRequirements.Get(policyName).ToArray();
            if (scopeNames.Count > 0 || requirements.Length > 0)
                options.AddPolicy(policyName, policy =>
                {
                    if (scopeNames.Count > 0)
                        policy.Requirements.Add(new ScopeAuthorizationRequirement(scopeNames));
                    foreach (var requirement in requirements)
                        policy.Requirements.Add(requirement);
                });
        }
    }
}