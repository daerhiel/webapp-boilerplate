using Microsoft.AspNetCore.OData;
using Microsoft.Extensions.Options;

namespace ConceptBed.OpenData;

/// <summary>
/// Represents an <see cref="IConfigureOptions{ODataOptions}"/> configurator object that sets up the respective service.
/// </summary>
public class ConfigureODataOptions : IConfigureOptions<ODataOptions>
{
    /// <inheritdoc/>
    public void Configure(ODataOptions options)
    {
        options.EnableQueryFeatures(maxTopValue: 1000);
        options.EnableNoDollarQueryOptions = false;
        options.RouteOptions.EnableControllerNameCaseInsensitive = true;
        options.QuerySettings.EnableCount = false;
        options.QuerySettings.EnableSelect = false;
    }
}
