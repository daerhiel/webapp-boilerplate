using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Net;

namespace ConceptBed.OpenApi;

/// <summary>
/// Represents an OpenApi generator <see cref="IOperationFilter"/> that generates the authentication responses for protected endpoints.
/// </summary>
internal class AuthorizeOperationFilter : IOperationFilter
{
    /// <inheritdoc/>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.ApiDescription.CustomAttributes().OfType<AuthorizeAttribute>().Any())
        {
            operation.Responses.Add(StatusCodes.Status401Unauthorized.ToString(), new OpenApiResponse
            {
                Description = nameof(HttpStatusCode.Unauthorized)
            });
            operation.Responses.Add(StatusCodes.Status403Forbidden.ToString(), new OpenApiResponse
            {
                Description = nameof(HttpStatusCode.Forbidden)
            });
        }
    }
}