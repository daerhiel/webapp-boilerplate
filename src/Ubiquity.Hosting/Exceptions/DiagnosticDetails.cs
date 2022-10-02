using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Ubiquity.Hosting.Exceptions;

/// <summary>
/// Represents a diagnostic <see cref="ProblemDetails"/> that encapsulates global application diagnostic responses.
/// </summary>
[JsonConverter(typeof(DiagnosticDetailsConverter))]
public class DiagnosticDetails : ProblemDetails
{
    /// <summary>
    /// The exception details associated with the current diagnostic reponse.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ExceptionDetails? Exception { get; set; }

    /// <summary>
    /// Initializes the new instance of a diagnostic <see cref="ProblemDetails"/>.
    /// </summary>
    public DiagnosticDetails()
    {
    }
}