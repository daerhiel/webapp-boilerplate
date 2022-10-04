using ConceptBed.Security.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Security.Claims;
using Xunit.Abstractions;

namespace ConceptBed.Security.Tests.Requirements;

public class IdentityActiveRequirementHandlerTests
{
    protected ITestOutputHelper Output { get; }

    public IdentityActiveRequirementHandlerTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01")]
    public async Task AuthorizeAsync(string testId)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, AuthorizationRoles.RoleName)
        }, "Basic"));

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAuthorization(options =>
        {
            options.AddPolicy(AuthorizationPolicies.IdentityActive, policy => policy.Requirements.Add(new IdentityActiveRequirement()));
        });
        services.AddSingleton<IAuthorizationHandler, IdentityActiveRequirementHandler>();

        var authorizationService = services.BuildServiceProvider().GetRequiredService<IAuthorizationService>();

        // Act
        var authorizationResult = await authorizationService.AuthorizeAsync(principal, AuthorizationPolicies.IdentityActive);

        // Assert
        Assert.True(authorizationResult.Succeeded);
    }
}