using Newtonsoft.Json;
using Ubiquity.Abstractions;

namespace Ubiquity.Hosting.Exceptions;

/// <summary>
/// Represents the serializeable exception details to be exposed through endpoint responses.
/// </summary>
public class ExceptionDetails
{
    /// <summary>
    /// The message associated with error response.
    /// </summary>
    public string Message { get; }

    /// <summary>
    /// The type of an error.
    /// </summary>
    public string Category { get; }

    /// <summary>
    /// The stack trace of an error.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string? StackTrace { get; }

    /// <summary>
    /// The inner serializeable error details if present.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ExceptionDetails? Inner { get; }

    /// <summary>
    /// The aggregated serializeable error details if present.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ExceptionDetails[]? Inners { get; }

    /// <summary>
    /// Initializes the new instance of a serializeable exception details.
    /// </summary>
    /// <param name="exception">The exception object to initialize the details from.</param>
    /// <param name="includeDetails">True if the error response should include detailed data.</param>
    /// <exception cref="ArgumentNullException">When <paramref name="exception"/> is null.</exception>
    public ExceptionDetails(Exception exception, bool includeDetails)
    {
        if (exception is null)
            throw new ArgumentNullException(nameof(exception));

        Message = exception.Message;
        Category = exception.GetType().FormatFullName();
        if (includeDetails)
        {
            if (exception.InnerException is Exception inner)
                Inner = new ExceptionDetails(inner, includeDetails);
            if (exception is AggregateException aggregate)
            {
                Inners = aggregate.InnerExceptions.Select(x =>
                {
                    return new ExceptionDetails(x, includeDetails);
                }).ToArray();
            }
            StackTrace = exception.StackTrace;
        }
    }
}