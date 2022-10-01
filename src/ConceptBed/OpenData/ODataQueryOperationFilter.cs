using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Ubiquity.Abstractions;

namespace ConceptBed.OpenApi;

/// <summary>
/// Represents an OpenApi generator <see cref="IOperationFilter"/> that generates the OData query parameters for query endpoints.
/// </summary>
internal class ODataQueryOperationFilter : IOperationFilter
{
    private const string _odataUrlTag = "<a href=\"http://docs.oasis-open.org/odata/odata/v4.01/cs01/part2-url-conventions/odata-v4.01-cs01-part2-url-conventions.html#sec_SystemQueryOptionfilter\" target=\"_blank\">OData spec filter options</a>";

    /// <summary>
    /// The required <see cref="ODataOptions"/> accessor instance.
    /// </summary>
    public IOptions<ODataOptions> Options { get; }

    /// <summary>
    /// Initializes the new instance of an OpenApi generator <see cref="IOperationFilter"/>.
    /// </summary>
    /// <param name="options">The required <see cref="ODataOptions"/> accessor instance.</param>
    public ODataQueryOperationFilter(IOptions<ODataOptions> options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc/>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAttribute = context.ApiDescription.CustomAttributes().OfType<EnableQueryAttribute>().Any();
        var hasParameter = context.ApiDescription.ParameterDescriptions.Any(x => typeof(ODataQueryOptions).IsAssignableFrom(x.Type));
        if ((hasAttribute || hasParameter) && Options.Value is ODataOptions options)
        {
            if (!context.SchemaRepository.TryLookupByType(typeof(bool), out var boolSchema))
                boolSchema = new OpenApiSchema { Type = typeof(bool).Name };
            if (!context.SchemaRepository.TryLookupByType(typeof(string), out var stringSchema))
                stringSchema = new OpenApiSchema { Type = typeof(string).Name };

            foreach (var parameterDescriptor in context.ApiDescription.ParameterDescriptions.Where(x => typeof(ODataQueryOptions).IsAssignableFrom(x.Type)))
            {
                if (operation.Parameters.FirstOrDefault(x => x.Schema.Reference.Id == parameterDescriptor.Type.FormatFullName() && parameterDescriptor.Name == x.Name) is OpenApiParameter parameter)
                    operation.Parameters.Remove(parameter);
            }

            var prefix = options.EnableNoDollarQueryOptions ? string.Empty : "$";
            if (options.QuerySettings.EnableFilter)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}filter",
                    Description = @$"This query option allows clients to filter a collection of resources that are addressed by a request URL.
The expression is evaluated for each resource in the collection, and only items where the expression evaluates to true are included in the response.
Resources for which the expression evaluates to false or to null, or which reference properties that are unavailable due to permissions, are omitted
from the response. You can find details on filter specification in the {_odataUrlTag} section.",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
            }

            if (options.QuerySettings.EnableSelect)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}select",
                    Description = @$"The {prefix}select system query option allows clients to request a specific set of properties for each entity or complex type.
This query option is often used in conjunction with the {prefix}expand system query option, to define the extent of the resource graph to return ({prefix}expand)
and then specify a subset of properties for each resource in the graph ({prefix}select).",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
            }

            if (options.QuerySettings.EnableExpand)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}expand",
                    Description = @"This query option specifies the related resources or media streams to be included in line with retrieved resources.
Each expandItem is evaluated relative to the entity containing the navigation or stream property being expanded.",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
            }

            if (options.QuerySettings.EnableOrderBy)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}orderby",
                    Description = @"This query option allows clients to request resources in a particular order.",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
            }

            if (options.QuerySettings.EnableSkipToken)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}top",
                    Description = @"This query option requests the number of items in the queried collection to be included in the result.",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}skip",
                    Description = @"This query option requests the number of items in the queried collection that are to be skipped and not included in the result.",
                    In = ParameterLocation.Query,
                    Schema = stringSchema,
                });
            }

            if (options.QuerySettings.EnableCount)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = $"{prefix}count",
                    Description = @"This query option allows clients to request a count of the matching resources included with the resources in the response.
The {prefix}count query option has a boolean value of true or false.",
                    In = ParameterLocation.Query,
                    Schema = boolSchema,
                });
            }
        }
    }
}