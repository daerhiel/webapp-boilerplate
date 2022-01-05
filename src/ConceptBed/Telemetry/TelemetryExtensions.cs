using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
using System.Net;

namespace ConceptBed.Telemetry
{
    /// <summary>
    /// The extension method container class for the <see cref="Telemetry"/> startup definitions.
    /// </summary>
    public static partial class TelemetryExtensions
    {
        /// <summary>
        /// Creates the transmission status event handler that responds to a telemetry transmission failure.
        /// </summary>
        /// <param name="serviceProvider">The interface to a dependency injection service provider instance that locates a service object.</param>
        /// <returns>The transmission status event handler created.</returns>
        private static EventHandler<TransmissionStatusEventArgs> GetTransmissionHandler(IServiceProvider serviceProvider) => (sender, e) =>
        {
            if (sender is Transmission transmission && e.Response is { StatusCode: not (int)HttpStatusCode.OK } response)
            {
                var logger = serviceProvider.GetRequiredService<ILogger<Transmission>>();
                logger.LogError("Unable to send telemetry to: {endpoint}, HTTP/{code}: {description}.", transmission.EndpointAddress, response.StatusCode, response.StatusDescription);
            }
        };

        /// <summary>
        /// Adds standard Application Insights telemetry services.
        /// </summary>
        /// <param name="services">The interface to a collection of service descriptors instance.</param>
        /// <param name="directory">The path to a storage location for telemetry channel data.</param>
        /// <returns>The interface to a collection of service descriptors instance for fluent calls.</returns>
        public static IServiceCollection AddApplicationInsightsTelemetryChannel(this IServiceCollection services, string directory)
        {
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            services.AddSingleton<ITelemetryChannel>(serviceProvider => new ServerTelemetryChannel
            {
                StorageFolder = directory,
                TransmissionStatusEvent = GetTransmissionHandler(serviceProvider)
            });
            services.AddTransient<ITelemetryInitializer, TelemetryInitializer>();
            return services;
        }
    }
}
