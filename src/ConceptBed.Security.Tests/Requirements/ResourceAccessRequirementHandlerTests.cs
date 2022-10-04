using ConceptBed.Security.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Security.Claims;
using Xunit.Abstractions;

namespace ConceptBed.Security.Tests.Requirements;

public class ResourceAccessRequirementHandlerTests
{
    protected ITestOutputHelper Output { get; }

    public ResourceAccessRequirementHandlerTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", AuthorizationPolicies.CanReadEntity, ResourceAccessTypes.Read, false)]
    [InlineData("02", AuthorizationPolicies.CanUpdateEntity, ResourceAccessTypes.Create, true)]
    [InlineData("03", AuthorizationPolicies.CanCreateEntity, ResourceAccessTypes.Update, false)]
    [InlineData("04", AuthorizationPolicies.CanRemoveEntity, ResourceAccessTypes.Remove, false)]
    public async Task AuthorizeAsync(string testId, string policyName, ResourceAccessTypes access, bool expectedResult)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, AuthorizationRoles.RoleName)
        }, "Basic"));

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAuthorization(options =>
        {
            options.AddPolicy(policyName, policy => policy.Requirements.Add(new ResourceAccessRequirement { Access = access }));
        });
        services.AddSingleton<IAuthorizationHandler, ResourceAccessRequirementHandler>();

        var authorizationService = services.BuildServiceProvider().GetRequiredService<IAuthorizationService>();

        // Act
        var authorizationResult = await authorizationService.AuthorizeAsync(user, null, policyName);

        // Assert
        Assert.Equal(expectedResult, authorizationResult.Succeeded);
    }
}