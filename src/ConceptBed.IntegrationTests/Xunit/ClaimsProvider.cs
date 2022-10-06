using System.Security.Claims;

namespace ConceptBed.IntegrationTests.Xunit;

public class ClaimsProvider
{
    public IList<Claim> Claims { get; }

    public ClaimsProvider(IList<Claim> claims) => Claims = claims;
}
