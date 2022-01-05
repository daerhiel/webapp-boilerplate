using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ConceptBed.Security.Requirements
{
    /// <summary>
    /// Represents an authorization handler that responds to the <see cref="ResourceAccessRequirement"/>.
    /// </summary>
    public class ResourceAccessRequirementHandler : AuthorizationHandler<ResourceAccessRequirement>
    {
        /// <inheritdoc/>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ResourceAccessRequirement requirement)
        {
            var user = context.User;
            if (user.FindFirst(x => x.Type == ClaimTypes.Role) is Claim role && !string.IsNullOrEmpty(role.Value))
                switch (requirement.Access)
                {
                    case var access when (access & ResourceAccessTypes.Create) != 0:
                        if (user.IsInRole(AuthorizationRoles.RoleName))
                            context.Succeed(requirement);
                        break;
                }
            return Task.CompletedTask;
        }
    }
}