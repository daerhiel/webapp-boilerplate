using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net;
using Ubiquity.Framework;

namespace Ubiquity.Hosting.Exceptions;

/// <summary>
/// Represents the problem details <see cref="IExceptionFilter"/> that responds to the Http pipeline exceptions.
/// </summary>
public class DiagnosticDetailsFilter : IExceptionFilter
{
    private readonly ApiBehaviorOptions _options;

    /// <summary>
    /// Creates the new instance of a problem details <see cref="IExceptionFilter"/>.
    /// </summary>
    /// <param name="options">The required <see cref="ApiBehaviorOptions"/> accessor instance.</param>
    /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
    public DiagnosticDetailsFilter(IOptions<ApiBehaviorOptions> options)
    {
        _options = options.Value ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc/>
    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;
        var statusCode = exception switch
        {
            ApplicationException => HttpStatusCode.BadRequest,
            FrameworkException e => e.StatusCode,
            UnauthorizedAccessException => HttpStatusCode.Forbidden,
            _ => HttpStatusCode.InternalServerError,
        };

        var problemDetails = new DiagnosticDetails
        {
            Status = (int)statusCode
        };

        // Add basic diagnostic problem details based on exception.
        if (!_options.ClientErrorMapping.TryGetValue((int)statusCode, out var clientError))
            problemDetails.Title = exception switch
            {
                ApplicationException or FrameworkException => $"An application error occurred, please refer the details.",
                UnauthorizedAccessException => $"An operation is forbidden.",
                _ => "An error has occurred, please refer to a trace id."
            };
        else
        {
            problemDetails.Title = clientError.Title;
            problemDetails.Type = clientError.Link;
        }

        // Add diagnostic details that come from current HttpContext.
        if (context.HttpContext is HttpContext httpContext)
        {
            problemDetails.Instance = httpContext.Request.GetDisplayUrl();

            // Add exception details.
            var environment = httpContext.RequestServices.GetService<IHostEnvironment>();
            var includeDetails = Debugger.IsAttached || environment is null || environment.IsDevelopment() || environment.IsStaging();

            if (exception is not null)
            {
                problemDetails.Exception = new ExceptionDetails(exception, includeDetails);
            }

            // Add trace information for debugging purposes.
            if ((Activity.Current?.Id ?? httpContext.TraceIdentifier) is string traceId)
            {
                problemDetails.Extensions[nameof(Activity.TraceId)] = traceId;
            }

            // Send telemetry trace if the telemetry client is active.
            httpContext.RequestServices.GetService<TelemetryClient>()?.TrackException(exception);
        }

        // Stream the problem details into the object result.
        context.Result = new ObjectResult(problemDetails)
        {
            StatusCode = problemDetails.Status
        };
        context.ExceptionHandled = true;
    }
}