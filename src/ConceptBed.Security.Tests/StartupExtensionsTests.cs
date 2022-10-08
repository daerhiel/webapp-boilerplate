using ConceptBed.Security.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using System.Diagnostics;
using Xunit.Abstractions;

namespace ConceptBed.Security.Tests;

public class StartupExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    public StartupExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01")]
    public void AddPermissions(string testId)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var services = new ServiceCollection().AddOptions();

        // Act
        var result = StartupExtensions.AddPermissions(services);
        var serviceProvider = result.BuildServiceProvider();

        // Assert
        Assert.Equal(services, result);
        var options = serviceProvider.GetService<IOptions<AuthorizationOptions>>();
        Assert.IsAssignableFrom<IOptions<AuthorizationOptions>>(options);
        Assert.IsType<AuthorizationOptions>(options!.Value);
        Assert.Collection(new[] { AuthorizationPolicies.IdentityActive }, policyName =>
        {
            switch (policyName)
            {
                case AuthorizationPolicies.IdentityActive when options.Value.GetPolicy(policyName) is { } policy:
                    var scopeNames = AuthorizationRequirements.GetScopes(policyName).ToHashSet(StringComparer.OrdinalIgnoreCase);
                    Assert.NotNull(policy);
                    Assert.Equivalent(new IAuthorizationRequirement[]
                    {
                        new ScopeAuthorizationRequirement(scopeNames),
                        new IdentityActiveRequirement()
                    }, policy.Requirements, true);
                    break;
            }
        });
    }
}