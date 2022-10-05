using ConceptBed.Controllers;
using ConceptBed.Data;
using ConceptBed.Data.Models;
using ConceptBed.Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Query.Validator;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OData.ModelBuilder;
using Microsoft.OData.UriParser;
using Moq;
using System;
using System.Diagnostics;
using System.Net.Http;
using Xunit.Abstractions;
using static Microsoft.Graph.Constants;
using static System.Net.WebRequestMethods;

namespace ConceptBed.Tests.Controllers;

public class WeatherForecastControllerTests
{
    protected ITestOutputHelper Output { get; }

    public WeatherForecastControllerTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var adapter = new Mock<IWeatherForecastAdapter>();

        // Act
        var controller = new WeatherForecastController(adapter.Object);

        // Assert
        Assert.NotNull(controller);
    }

    [Fact]
    public async Task Get()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var id = Guid.NewGuid();
        var adapter = new Mock<IWeatherForecastAdapter>();
        var controller = new WeatherForecastController(adapter.Object);

        // Act
        var element = await controller.Get(id, new CancellationToken());

        // Assert
        adapter.Verify(x => x.FindAsync(id, new CancellationToken()), Times.Once);
    }

    [Fact]
    public async Task Query()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddControllers().AddOData();
        services.AddODataQueryFilter();
        services.AddTransient<ODataUriResolver>();
        services.AddTransient<ODataQueryValidator>();
        services.AddTransient<TopQueryValidator>();
        services.AddTransient<FilterQueryValidator>();
        services.AddTransient<SkipQueryValidator>();
        services.AddTransient<OrderByQueryValidator>();
        var serviceProvider = services.BuildServiceProvider();

        var uri = new Uri("http://test/api/odata");
        var httpContext = new DefaultHttpContext { RequestServices = serviceProvider };
        httpContext.Request.Method = "GET";
        httpContext.Request.Host = new HostString(uri.Host, uri.Port);
        httpContext.Request.Path = uri.LocalPath;
        httpContext.Request.QueryString = new QueryString(uri.Query);

        var modelBuilder = new ODataConventionModelBuilder();
        modelBuilder.EntitySet<WeatherForecast>(nameof(WeatherForecast));
        var model = modelBuilder.GetEdmModel();

        var context = new ODataQueryContext(model, typeof(WeatherForecast), new ODataPath());
        var options = new ODataQueryOptions<WeatherForecast>(context, httpContext.Request);
        var adapter = new Mock<IWeatherForecastAdapter>();
        adapter.Setup(x => x.GetQuery()).Returns(() =>
        {
            var options = new DbContextOptionsBuilder<ConceptContext>().UseInMemoryDatabase($"WeatherDb_{Guid.NewGuid()}");
            var context = new ConceptContext(options.Options);
            return context.Forecasts;
        });
        var controller = new WeatherForecastController(adapter.Object);

        // Act
        var element = await controller.Query(options, new CancellationToken());

        // Assert
        adapter.Verify(x => x.GetQuery(), Times.Once);
    }
}