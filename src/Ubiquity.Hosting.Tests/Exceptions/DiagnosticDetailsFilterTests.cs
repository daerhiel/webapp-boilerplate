using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net;
using Ubiquity.Framework;
using Ubiquity.Hosting.Exceptions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Hosting.Tests.Exceptions;

public class DiagnosticDetailsFilterTests
{
    protected ITestOutputHelper Output { get; }

    public DiagnosticDetailsFilterTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", null, HttpStatusCode.InternalServerError, "An error occurred while processing your request.")]
    [InlineData("02", nameof(ApplicationException), HttpStatusCode.BadRequest, "Bad Request")]
    [InlineData("03", nameof(FrameworkException), HttpStatusCode.BadRequest, "Bad Request")]
    [InlineData("04", nameof(FrameworkException), HttpStatusCode.NotFound, "Not Found")]
    public void Ctor_Context(string testId, string exceptionId, HttpStatusCode status, string message)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var exceptions = new Dictionary<string, Exception>()
        {
            { nameof(ApplicationException), new ApplicationException("") },
            { nameof(FrameworkException), new FrameworkException(status, "") }
        };
        var services = new ServiceCollection();
        services.AddMvc();
        var serviceProvider = services.BuildServiceProvider();
        var actionContext = new ActionContext()
        {
            HttpContext = new DefaultHttpContext()
            {
                RequestServices = serviceProvider
            },
            RouteData = new RouteData(),
            ActionDescriptor = new ActionDescriptor()
        };
        var exceptionContext = new ExceptionContext(actionContext, new List<IFilterMetadata>())
        {
            Exception = exceptionId is not null && exceptions.TryGetValue(exceptionId, out var exception) ? exception : null!
        };
        var apiBehaviorOptions = serviceProvider.GetRequiredService<IOptions<ApiBehaviorOptions>>();
        var diagnosticDetailsFilter = new DiagnosticDetailsFilter(apiBehaviorOptions);

        // Act
        diagnosticDetailsFilter.OnException(exceptionContext);

        // Assert
        Assert.IsType<ObjectResult>(exceptionContext.Result);
        if (exceptionContext.Result is ObjectResult result)
        {
            Assert.Equal((int)status, result.StatusCode);
            Assert.IsType<DiagnosticDetails>(result.Value);
            if (result.Value is DiagnosticDetails diagnosticDetails)
            {
                Assert.Equal(message, diagnosticDetails.Title);
                Assert.Equal((int)status, diagnosticDetails.Status);
            }
        }
    }
}