using ConceptBed.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ubiquity.Data;

namespace ConceptBed.Framework
{
    /// <summary>
    /// Represents the extension method container class for the startup configuration methods.
    /// </summary>
    public static partial class StartupExtensions
    {
        /// <summary>
        /// Adds the application framework services to the dependency injection container.
        /// </summary>
        /// <param name="services">The interface to a service desctiptor collection.</param>
        /// <param name="configuration">The interfact to an application configuration properties.</param>
        /// <returns>The interface to a service desctiptor collection for the fluent calls.</returns>
        public static IServiceCollection AddFramework(this IServiceCollection services, IConfiguration configuration)
        {
            // Add application business logic services
            services.AddTransient<IWeatherForecastAdapter, WeatherForecastAdapter>();

            // Add data access layer services
            if (!string.IsNullOrWhiteSpace(configuration.GetConnectionString("ConceptDb")))
            {
                services.AddSqliteContext<ConceptContext>(configuration, "ConceptDb");
                services.AddScoped<ConceptUnitOfWork<ConceptContext>>();
            }
            return services;
        }
    }
}