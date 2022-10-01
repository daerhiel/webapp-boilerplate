using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ConceptBed.OpenApi;

/// <summary>
/// Represents an OpenApi generator <see cref="IConfigureOptions{SwaggerGenOptions}"/> configurator object that sets up the respective service.
/// </summary>
internal class ConfigureSwaggerGenODataOptions : IConfigureOptions<SwaggerGenOptions>
{
    /// <summary>
    /// The set of key/value application configuration properties.
    /// </summary>
    public IConfiguration Configuration { get; }

    /// <summary>
    /// Initializes the new instance of an OpenApi generator <see cref="IConfigureOptions{SwaggerGenOptions}"/> configurator object.
    /// </summary>
    /// <param name="configuration">The set of key/value application configuration properties.</param>
    /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
    public ConfigureSwaggerGenODataOptions(IConfiguration configuration)
    {
        Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    /// <inheritdoc/>
    public void Configure(SwaggerGenOptions options)
    {
        options.OperationFilter<ODataQueryOperationFilter>();
    }
}