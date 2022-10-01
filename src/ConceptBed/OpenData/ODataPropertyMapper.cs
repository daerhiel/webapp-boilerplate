using Microsoft.AspNetCore.OData.Query.Container;
using Microsoft.OData.Edm;
using Newtonsoft.Json.Serialization;

namespace ConceptBed.OpenApi;

/// <summary>
/// The camel-case Edm property name mapper.
/// </summary>
internal class ODataPropertyMapper : IPropertyMapper
{
    private static readonly ODataPropertyMapper _default = new();
    private static readonly NamingStrategy _strategy = new CamelCaseNamingStrategy();

    /// <inheritdoc/>
    public string MapProperty(string propertyName) => _strategy.GetPropertyName(propertyName, false);

#pragma warning disable IDE0060 // Remove unused parameter
    /// <summary>
    /// Creates the camel-case Edm property name mapper.
    /// </summary>
    /// <param name="model">The Edm model to validate the type against.</param>
    /// <param name="type">The Edm type to validate the property against.</param>
    /// <returns></returns>
    internal static IPropertyMapper Create(IEdmModel model, IEdmStructuredType type) => _default;
#pragma warning restore IDE0060 // Remove unused parameter
}