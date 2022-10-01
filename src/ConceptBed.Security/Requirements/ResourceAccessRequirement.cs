using Microsoft.AspNetCore.Authorization;

namespace ConceptBed.Security.Requirements;

/// <summary>
/// Represents the authorization requirement that validates if the current identity has access to the requested resource.
/// </summary>
public class ResourceAccessRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// The access level associated with the current requirement.
    /// </summary>
    public ResourceAccessTypes Access { get; init; }
}