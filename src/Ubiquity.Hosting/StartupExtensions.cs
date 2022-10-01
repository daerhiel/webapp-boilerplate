using Microsoft.AspNetCore.Builder;

namespace Ubiquity.Hosting;

/// <summary>
/// The extension method container class for the <see cref="Hosting"/> startup definitions.
/// </summary>
public static class StartupExtensions
{
    /// <summary>
    /// Registers and configures the middleware and runtime for diagnostic features.
    /// </summary>
    /// <param name="app">The <see cref="IApplicationBuilder"/> instance to configure the request pipeline.</param>
    /// <returns>The <see cref="IApplicationBuilder"/> instance for the fluent calls.</returns>
    public static IApplicationBuilder UseDiagnostic(this IApplicationBuilder app)
    {
        return app;
    }
}