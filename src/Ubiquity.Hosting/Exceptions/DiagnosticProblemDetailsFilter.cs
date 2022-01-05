using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;

namespace Ubiquity.Hosting.Exceptions
{
    /// <summary>
    /// Represents the problem details <see cref="IExceptionFilter"/> that responds to the Http pipeline exceptions.
    /// </summary>
    public class DiagnosticProblemDetailsFilter : IExceptionFilter
    {
        private readonly ApiBehaviorOptions _options;

        /// <summary>
        /// Creates the new instance of a problem details <see cref="IExceptionFilter"/>.
        /// </summary>
        /// <param name="options">The required <see cref="ApiBehaviorOptions"/> accessor instance.</param>
        /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
        public DiagnosticProblemDetailsFilter(IOptions<ApiBehaviorOptions> options)
        {
            _options = options.Value ?? throw new ArgumentNullException(nameof(options));
        }

        /// <inheritdoc/>
        public void OnException(ExceptionContext context)
        {
            var problemDetails = new DiagnosticProblemDetails(context, _options);
            context.Result = new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status,
            };
            context.ExceptionHandled = true;
        }
    }
}