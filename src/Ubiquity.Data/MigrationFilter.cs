using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Ubiquity.Data;

/// <summary>
/// Represents the startup filter that is required to run after <typeparamref name="TContext"/> is registered.
/// </summary>
/// <typeparam name="TContext">The type of database context to run the filter for.</typeparam>
public class MigrationFilter<TContext> : IStartupFilter
    where TContext : DbContext
{
    /// <summary>
    /// The interface to a dependency injection service provider instance that locates a service object.
    /// </summary>
    protected IServiceProvider ServiceProvider { get; }

    /// <summary>
    /// Initializes the new instance of a startup filter.
    /// </summary>
    /// <param name="serviceProvider">The interface to a dependency injection service provider instance that locates a service object.</param>
    /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
    public MigrationFilter(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    /// <summary>
    /// Configures the <typeparamref name="TContext"/> upon the application startup.
    /// </summary>
    /// <param name="next">The next startup filter action to run.</param>
    /// <returns>The next startup filter action to run.</returns>
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        using var scope = ServiceProvider.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<TContext>();
        if (context.Database.IsRelational())
        {
            context.Database.Migrate();
        }
        return next;
    }
}