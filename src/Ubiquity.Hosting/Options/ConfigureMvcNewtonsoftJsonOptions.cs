using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents an <see cref="IConfigureOptions{MvcNewtonsoftJsonOptions}"/> configurator object that sets up the respective service.
    /// </summary>
    public class ConfigureMvcNewtonsoftJsonOptions : IConfigureOptions<MvcNewtonsoftJsonOptions>
    {
        /// <inheritdoc/>
        public void Configure(MvcNewtonsoftJsonOptions options)
        {
            if (options.SerializerSettings.ContractResolver is DefaultContractResolver { NamingStrategy: NamingStrategy namingStrategy })
                namingStrategy.ProcessDictionaryKeys = false;
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            options.SerializerSettings.NullValueHandling = NullValueHandling.Include;
            options.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            options.SerializerSettings.DateParseHandling = DateParseHandling.DateTime;
            options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
        }
    }
}