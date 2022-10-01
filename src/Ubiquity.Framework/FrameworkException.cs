using System.Net;
using System.Runtime.Serialization;

namespace Ubiquity.Framework;

/// <summary>
/// Represents the <see cref="FrameworkException"/> application logic framework exception that is allowed to pass to the clients.
/// </summary>
public class FrameworkException : Exception
{
    /// <summary>
    /// The API operation status code to push to the operation result. The default is <see cref="HttpStatusCode.BadRequest"/>.
    /// </summary>
    public HttpStatusCode StatusCode { get; } = HttpStatusCode.BadRequest;

    /// <inheritdoc/>
    public FrameworkException()
    {
    }

    /// <summary>
    /// Initalizes thew new instance of a <see cref="FrameworkException"/> application logic framework exception.
    /// </summary>
    /// <param name="code">The API operation status code to push to the operation result.</param>
    public FrameworkException(HttpStatusCode code)
    {
        StatusCode = code;
    }

    /// <inheritdoc/>
    public FrameworkException(string message)
        : base(message)
    {
    }

    /// <summary>
    /// Initalizes thew new instance of a <see cref="FrameworkException"/> application logic framework exception.
    /// </summary>
    /// <param name="code">The API operation status code to push to the operation result.</param>
    /// <param name="message">The message that describes the error.</param>
    public FrameworkException(HttpStatusCode code, string message)
        : base(message)
    {
        StatusCode = code;
    }

    /// <inheritdoc/>
    public FrameworkException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

    /// <summary>
    /// Initalizes thew new instance of a <see cref="FrameworkException"/> application logic framework exception.
    /// </summary>
    /// <param name="code">The API operation status code to push to the operation result.</param>
    /// <param name="message">The message that describes the error.</param>
    /// <param name="innerException">The exception that is the cause of the current exception, or a null if no inner exception is specified.</param>
    public FrameworkException(HttpStatusCode code, string message, Exception innerException)
        : base(message, innerException)
    {
        StatusCode = code;
    }

    /// <inheritdoc/>
    protected FrameworkException(SerializationInfo info, StreamingContext context)
        : base(info, context)
    {
    }
}