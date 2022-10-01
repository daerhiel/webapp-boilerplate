using Microsoft.AspNetCore.Authorization;

namespace ConceptBed.Security.Requirements;

/// <summary>
/// Represents an authorization handler that responds to the <see cref="IdentityActiveRequirement"/>.
/// </summary>
public class IdentityActiveRequirementHandler : AuthorizationHandler<IdentityActiveRequirement>
{
    /// <inheritdoc/>
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IdentityActiveRequirement requirement)
    {
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}