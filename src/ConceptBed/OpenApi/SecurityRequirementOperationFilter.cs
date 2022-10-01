using ConceptBed.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ConceptBed.OpenApi;

/// <summary>
/// Represents an OpenApi generator <see cref="IOperationFilter"/> that generates the security requirements for the protected endpoints.
/// </summary>
internal class SecurityRequirementOperationFilter : IOperationFilter
{
    private readonly IConfiguration _configuration;

    /// <summary>
    /// Initializes the new instance of an OpenApi generator <see cref="IOperationFilter"/>.
    /// </summary>
    /// <param name="configuration">The set of key/value application configuration properties.</param>
    public SecurityRequirementOperationFilter(IConfiguration configuration)
    {
        if (configuration is null)
            throw new ArgumentNullException(nameof(configuration));

        _configuration = configuration;
    }

    /// <inheritdoc/>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var configuration = _configuration.GetSection(Constants.AzureAd);
        var attributes = context.ApiDescription.CustomAttributes();
        if (!attributes.OfType<AllowAnonymousAttribute>().Any() && attributes.OfType<AuthorizeAttribute>().ToArray() is { Length: > 0 } authorizations)
        {
            var audience = configuration.GetValue<string>("Audience") ?? $"api://{configuration.GetValue<string>("ClientId")}";
            var policyNames = authorizations.Select(x => x.Policy).ToArray();
            var scopes = AuthorizationRequirements.GetScopes(policyNames).Select(x => $"{audience}/{x}").ToArray();
            var scheme = new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "AzureAD" },
                UnresolvedReference = true
            };
            operation.Security.Add(new OpenApiSecurityRequirement { { scheme, scopes } });
        }
    }
}