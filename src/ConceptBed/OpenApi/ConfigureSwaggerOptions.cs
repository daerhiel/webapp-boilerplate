using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;

namespace ConceptBed.OpenApi;

/// <summary>
/// Represents an OpenApi generator <see cref="IConfigureOptions{SwaggerOptions}"/> configurator object that sets up the respective service.
/// </summary>
internal class ConfigureSwaggerOptions : IConfigureOptions<SwaggerOptions>
{
    /// <inheritdoc/>
    public void Configure(SwaggerOptions options)
    {
        options.RouteTemplate = "/api-docs/{documentName}/swagger.json";
    }
}