using ConceptBed.Security;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Ubiquity.Abstractions;

namespace ConceptBed.OpenApi
{
    /// <summary>
    /// Represents an OpenApi generator <see cref="IConfigureOptions{SwaggerGenOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    internal class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationManager<OpenIdConnectConfiguration> _configurationManager;
        private readonly IApiVersionDescriptionProvider _descriptionProvider;

        /// <summary>
        /// Initializes the new instance of an OpenApi generator <see cref="IConfigureOptions{SwaggerGenOptions}"/> configurator object.
        /// </summary>
        /// <param name="configuration">The set of key/value application configuration properties.</param>
        /// <param name="configurationManager">The interface to an OpenID Connect configuration manager.</param>
        /// <param name="descriptionProvider">The instance of a provider that discovers and describes API version information.</param>
        /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
        public ConfigureSwaggerGenOptions(IConfiguration configuration, IConfigurationManager<OpenIdConnectConfiguration> configurationManager, IApiVersionDescriptionProvider descriptionProvider)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _configurationManager = configurationManager ?? throw new ArgumentNullException(nameof(configurationManager));
            _descriptionProvider = descriptionProvider ?? throw new ArgumentNullException(nameof(descriptionProvider));
        }

        /// <inheritdoc/>
        public void Configure(SwaggerGenOptions options)
        {
            var openApi = _configuration.GetSection(nameof(OpenApi));
            var configuration = _configuration.GetSection(Constants.AzureAd);
            var audience = configuration.GetValue<string>("Audience") ?? $"api://{configuration.GetValue<string>("ClientId")}";
            var document = _configurationManager.GetConfigurationAsync(new CancellationToken()).GetAwaiter().GetResult();

            options.OperationFilter<AuthorizeOperationFilter>();
            options.OperationFilter<SecurityRequirementOperationFilter>();
            options.DescribeAllParametersInCamelCase();
            options.CustomSchemaIds(x => x.FullName);

            foreach (var description in _descriptionProvider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, new OpenApiInfo
                {
                    Title = openApi.GetValue<string>(nameof(OpenApiInfo.Title)),
                    Description = openApi.GetValue<string>(nameof(OpenApiInfo.Description)),
                    Version = description.ApiVersion.ToString(),
                    Contact = openApi.GetSection(nameof(OpenApiInfo.Contact)).Get<OpenApiContact>(),
                    License = openApi.GetSection(nameof(OpenApiInfo.License)).Get<OpenApiLicense>()
                });
            }

            options.CustomSchemaIds(type => type.FormatFullName());

            options.AddSecurityDefinition("AzureAD", new OpenApiSecurityScheme
            {
                Description = "Security Scheme",
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = new Uri(document.AuthorizationEndpoint),
                        TokenUrl = new Uri(document.TokenEndpoint),
                        Scopes = AuthorizationScopes.GetScopes(audience)
                    }
                }
            });
            options.IgnoreObsoleteActions();
            options.IgnoreObsoleteProperties();
        }
    }
}