using Microsoft.Identity.Web;
using System.Security.Claims;

namespace ConceptBed.IntegrationTests.Xunit;

public class ClaimsProviderBuilder
{
    private readonly List<Claim> _claims = new();

    public ClaimsProviderBuilder()
    {
        _claims.Add(new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()));
    }

    public ClaimsProviderBuilder WithScopes(params string[] scopes)
    {
        _claims.Add(new Claim(ClaimConstants.Scope, string.Join(' ', scopes.Where(x => !string.IsNullOrWhiteSpace(x)))));
        return this;
    }

    public ClaimsProviderBuilder WithRole(params string[] roles)
    {
        foreach (var role in roles)
        {
            _claims.Add(new Claim(ClaimConstants.Role, roles[0]));
        }
        return this;
    }

    public ClaimsProvider Build() => new(_claims.ToArray());
}