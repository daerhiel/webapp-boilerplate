using Microsoft.AspNetCore.Authorization;

namespace ConceptBed.Security.Requirements;

/// <summary>
/// Represents an authorization requirement descriptor that validates the identity state.
/// </summary>
public class IdentityActiveRequirement : IAuthorizationRequirement
{
}