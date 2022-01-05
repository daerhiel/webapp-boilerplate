using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using Ubiquity.Framework;

namespace Ubiquity.Hosting.Exceptions
{

    /// <summary>
    /// Represents a diagnostic <see cref="ProblemDetails"/> that encapsulates global application diagnostic responses.
    /// </summary>
    [JsonConverter(typeof(DiagnosticProblemDetailsConverter))]
    public class DiagnosticProblemDetails : ProblemDetails
    {
        /// <summary>
        /// The exception details associated with the current diagnostic reponse.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public object? Exception { get; }

        /// <summary>
        /// Initializes the new instance of a diagnostic <see cref="ProblemDetails"/>.
        /// </summary>
        public DiagnosticProblemDetails()
        {
        }

        /// <summary>
        /// Initializes the new instance of a diagnostic <see cref="ProblemDetails"/>.
        /// </summary>
        /// <param name="exceptionContext">The context for exception filters <see cref="IExceptionFilter"/> containing problem.</param>
        /// <param name="options">The required <see cref="ApiBehaviorOptions"/> accessor instance.</param>
        public DiagnosticProblemDetails(ExceptionContext exceptionContext, ApiBehaviorOptions options)
        {
            // Add basic diagnostic problem details based on exception.
            var statusCode = exceptionContext.Exception switch
            {
                ApplicationException => HttpStatusCode.BadRequest,
                FrameworkException e => e.StatusCode,
                UnauthorizedAccessException => HttpStatusCode.Forbidden,
                _ => HttpStatusCode.InternalServerError,
            };
            if (options.ClientErrorMapping.TryGetValue((int)statusCode, out var clientError))
            {
                Title = clientError.Title;
                Type = clientError.Link;
            }
            Title = exceptionContext.Exception switch
            {
                ApplicationException or FrameworkException => $"An application error occurred, please refer the details.",
                UnauthorizedAccessException => $"An operation is forbidden.",
                _ => Title
            };
            Status = (int)statusCode;

            // Add diagnostic details that come from current HttpContext.
            if (exceptionContext.HttpContext is HttpContext httpContext)
            {
                Instance = httpContext.Request.GetDisplayUrl();

                // Add exception details.
                var environment = httpContext.RequestServices.GetService<IHostEnvironment>();
                var includeDetails = Debugger.IsAttached || environment.IsDevelopment() || environment.IsStaging();
                Exception = new ExceptionDetails(exceptionContext.Exception, includeDetails);

                // Add trace information for debugging purposes.
                if ((Activity.Current?.Id ?? httpContext.TraceIdentifier) is string traceId)
                {
                    Extensions[nameof(Activity.TraceId)] = traceId;
                }

                // Send telemetry trace if the telemetry client is active.
                httpContext.RequestServices.GetService<TelemetryClient>()?.TrackException(exceptionContext.Exception);
            }
        }
    }
}