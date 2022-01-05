using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Ubiquity.Data
{
    /// <summary>
    /// Represents the extension method container class for the startup configuration methods.
    /// </summary>
    public static partial class StartupExtensions
    {
        /// <summary>
        /// Adds the Sqlite database services to the dependency injection container.
        /// </summary>
        /// <param name="services">The interface to a collection of service descriptors instance.</param>
        /// <param name="configuration">The interfact to an application configuration properties.</param>
        /// <param name="name">The name of a connection string to associate with the services.</param>
        /// <param name="migrate">True if a <see cref="MigrationFilter{TContext}"/> is required to be registered; otherwise, false.</param>
        /// <returns>The interface to a service desctiptor collection for the fluent calls.</returns>
        public static IServiceCollection AddSqliteContext<TContext>(this IServiceCollection services, IConfiguration configuration, string name, bool migrate = true)
            where TContext : DbContext
        {
            var storage = ConfigurationBinder.Get<StorageConfiguration>(configuration.GetSection(StorageConfiguration.Storage));
            services.AddDbContextPool<TContext>(builder => builder.UseSqlite(configuration.GetConnectionString(name), options =>
            {
                options.CommandTimeout(30);
                options.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                options.UseRelationalNulls();
            }));
            if (migrate && (!Debugger.IsAttached || storage?.EnforceMigration == true))
            {
                services.AddTransient<IStartupFilter, MigrationFilter<TContext>>();
            }
            return services;
        }

        /// <summary>
        /// Adds the Sql server database services to the dependency injection container.
        /// </summary>
        /// <param name="services">The interface to a collection of service descriptors instance.</param>
        /// <param name="configuration">The interfact to an application configuration properties.</param>
        /// <param name="name">The name of a connection string to associate with the services.</param>
        /// <param name="migrate">True if a <see cref="MigrationFilter{TContext}"/> is required to be registered; otherwise, false.</param>
        /// <returns>The interface to a service desctiptor collection for the fluent calls.</returns>
        public static IServiceCollection AddSqlServerContext<TContext>(this IServiceCollection services, IConfiguration configuration, string name, bool migrate = true)
            where TContext : DbContext
        {
            var storage = ConfigurationBinder.Get<StorageConfiguration>(configuration.GetSection(StorageConfiguration.Storage));
            services.AddDbContextPool<TContext>(builder => builder.UseSqlServer(configuration.GetConnectionString(name), options =>
            {
                options.CommandTimeout(30);
                options.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                options.EnableRetryOnFailure();
            }));
            if (migrate && (!Debugger.IsAttached || storage.EnforceMigration))
            {
                services.AddTransient<IStartupFilter, MigrationFilter<TContext>>();
            }
            return services;
        }
    }
}