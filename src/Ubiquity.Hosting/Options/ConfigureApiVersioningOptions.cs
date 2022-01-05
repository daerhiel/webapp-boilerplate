using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Options;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{ApiVersioningOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureApiVersioningOptions : IConfigureOptions<ApiVersioningOptions>
    {
        /// <inheritdoc/>
        public void Configure(ApiVersioningOptions options)
        {
            options.ReportApiVersions = true;
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.DefaultApiVersion = new ApiVersion(1, 0);
        }
    }
}