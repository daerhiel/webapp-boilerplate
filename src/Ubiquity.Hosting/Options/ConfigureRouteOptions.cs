using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{RouteOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureRouteOptions : IConfigureOptions<RouteOptions>
    {
        /// <inheritdoc/>
        public void Configure(RouteOptions options)
        {
            options.LowercaseUrls = true;
        }
    }
}