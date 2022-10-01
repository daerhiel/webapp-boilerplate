using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Net.Http.Headers;
using System.Net;
using System.Security.Claims;

namespace ConceptBed.Telemetry;

/// <summary>
/// Represents the telemetry initializer that sets <see cref="ITelemetry"/> object common properties.
/// </summary>
public class TelemetryInitializer : ITelemetryInitializer
{
    /// <summary>
    /// The interface to a current <see cref="HttpContext"/> accessor.
    /// </summary>
    public IHttpContextAccessor? ContextAccessor { get; }

    /// <summary>
    /// Initializes the new instance of a telemetry initializer.
    /// </summary>
    /// <param name="contextAccessor">The interface to a current <see cref="HttpContext"/> accessor.</param>
    public TelemetryInitializer(IHttpContextAccessor? contextAccessor) => ContextAccessor = contextAccessor;

    /// <inheritdoc/>
    public void Initialize(ITelemetry telemetry)
    {
        if (telemetry is not null && ContextAccessor?.HttpContext is var context)
        {
            telemetry.Context.Cloud.RoleName ??= "ConceptBed";
            telemetry.Context.Cloud.RoleInstance ??= Dns.GetHostName();

            if (telemetry == context?.Features.Get<RequestTelemetry>() && context.User is ClaimsPrincipal principal)
            {
                if (principal.FindFirst(x => x.Type == ClaimTypes.Name) is Claim name)
                {
                    telemetry.Context.User.Id = name.Value?.ToLower();
                    telemetry.Context.User.AuthenticatedUserId = name.Value?.ToLower();
                }
                if (context.Request.Headers.TryGetValue(HeaderNames.UserAgent, out var agents))
                    telemetry.Context.User.UserAgent = agents;
                telemetry.Context.Location.Ip = context.Connection.RemoteIpAddress?.ToString();
            }
        }
    }
}
