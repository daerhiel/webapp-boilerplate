using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace ConceptBed.OpenApi
{
    /// <summary>
    /// Represents an OpenApi generator <see cref="IConfigureOptions{SwaggerUIOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    internal class ConfigureSwaggerUIOptions : IConfigureOptions<SwaggerUIOptions>
    {
        private readonly IConfiguration _configuration;
        private readonly IApiVersionDescriptionProvider _descriptionProvider;

        /// <summary>
        /// Initializes the new instance of an OpenApi generator <see cref="IConfigureOptions{SwaggerUIOptions}"/> configurator object.
        /// </summary>
        /// <param name="configuration">The set of key/value application configuration properties.</param>
        /// <param name="descriptionProvider">The instance of a provider that discovers and describes API version information.</param>
        /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
        public ConfigureSwaggerUIOptions(IConfiguration configuration, IApiVersionDescriptionProvider descriptionProvider)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _descriptionProvider = descriptionProvider ?? throw new ArgumentNullException(nameof(descriptionProvider));
        }

        /// <inheritdoc/>
        public void Configure(SwaggerUIOptions options)
        {
            var openApi = _configuration.GetSection(nameof(OpenApi));
            var applicationName = openApi.GetValue<string>("ApplicationName");
            var clientId = openApi.GetValue<string>("ClientId");

            options.RoutePrefix = "api-docs";
            foreach (var description in _descriptionProvider.ApiVersionDescriptions)
            {
                options.SwaggerEndpoint($"/api-docs/{description.GroupName}/swagger.json", $"{applicationName} API {description.GroupName}");
            }

            options.OAuthAppName(applicationName);
            options.OAuthClientId(clientId);
            options.OAuthScopeSeparator(" ");
            options.OAuthUsePkce();
        }
    }
}