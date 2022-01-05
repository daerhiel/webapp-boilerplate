using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ConceptBed.OpenData
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{JsonOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureODataJsonOptions : IConfigureOptions<JsonOptions>
    {
        /// <inheritdoc/>
        public void Configure(JsonOptions options)
        {
        }
    }
}
