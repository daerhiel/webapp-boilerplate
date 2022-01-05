using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Ubiquity.Hosting.Exceptions;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{MvcOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureMvcOptions : IConfigureOptions<MvcOptions>
    {
        /// <inheritdoc/>
        public void Configure(MvcOptions options)
        {
            options.Filters.Add<DiagnosticProblemDetailsFilter>();
            options.Conventions.Add(new RoutePrefixConvention(new RouteAttribute("api/v{version:apiVersion}")));
        }
    }
}