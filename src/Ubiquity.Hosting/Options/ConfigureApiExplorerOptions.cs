using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{ApiExplorerOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureApiExplorerOptions : IConfigureOptions<ApiExplorerOptions>
    {
        /// <inheritdoc/>
        public void Configure(ApiExplorerOptions options)
        {
            options.GroupNameFormat = "'v'VVV";
            options.AddApiVersionParametersWhenVersionNeutral = false;
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.SubstituteApiVersionInUrl = true;
        }
    }
}