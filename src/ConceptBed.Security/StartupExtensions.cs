using ConceptBed.Security.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ConceptBed.Security;

/// <summary>
/// Represents the extension method container class for the startup configuration methods.
/// </summary>
public static partial class StartupExtensions
{
    /// <summary>
    /// Adds the application framework services to the dependency injection container.
    /// </summary>
    /// <param name="services">The interface to a service desctiptor collection.</param>
    /// <returns>The interface to a service desctiptor collection for the fluent calls.</returns>
    public static IServiceCollection AddPermissions(this IServiceCollection services)
    {
        services.AddTransient<IConfigureOptions<AuthorizationOptions>, ConfigureAuthorizationOptions>();
        return services;
    }
}