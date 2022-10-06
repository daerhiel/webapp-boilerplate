using ConceptBed.Controllers;
using ConceptBed.Data.Models;
using ConceptBed.IntegrationTests.Xunit;
using ConceptBed.OpenData;
using ConceptBed.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Web;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace ConceptBed.IntegrationTests;

public class ConceptBedTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    protected ITestOutputHelper Output { get; }

    public ConceptBedTests(ITestOutputHelper output, WebApplicationFactory<Program> factory)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));

        _factory = factory?.WithWebHostBuilder(builder => builder.ConfigureTestServices(services =>
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = ClaimsAuthenticationHandler.AuthenticationScheme;
                options.DefaultChallengeScheme = ClaimsAuthenticationHandler.AuthenticationScheme;
            }).AddScheme<AuthenticationSchemeOptions, ClaimsAuthenticationHandler>(ClaimsAuthenticationHandler.AuthenticationScheme, options =>
            {
            });
            services.AddSingleton(_ => new ClaimsProviderBuilder().WithScopes(AuthorizationScopes.UserImpersonation).Build());
        })) ?? throw new ArgumentNullException(nameof(factory));
    }

    [Theory]
    [InlineData("01", "")]
    [InlineData("02", "/index.html")]
    [InlineData("03", "/v1/swagger.json")]
    public async Task ApiDocs(string testId, string path)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(ClaimsAuthenticationHandler.AuthenticationScheme);
        var uri = new Uri($"http://localhost/api-docs{path}");

        // Act
        var response = await client.GetAsync(uri);

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadAsStringAsync();
        Assert.NotNull(result);
    }

    [Theory]
    [InlineData("01", "63064af7-4fce-413a-b102-e0560701cd21")]
    public async Task Get(string testId, string id)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(ClaimsAuthenticationHandler.AuthenticationScheme);
        var uri = new Uri($"http://localhost/api/v1/weatherforecast/{id}");

        // Act
        var response = await client.GetAsync(uri);

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<WeatherForecast>();
        Assert.NotNull(result);
        Assert.IsType<WeatherForecast>(result);
        Assert.Equal(new Guid(id), result!.Id);
    }

    [Theory]
    [InlineData("01", "temperature gt 30", "history")]
    [InlineData("02", "temperature gt 30", null, "temperature", null, 10)]
    public async Task Query(string testId, string filter, string? expand = null, string? orderBy = null, int? top = null, long? skip = null)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(ClaimsAuthenticationHandler.AuthenticationScheme);

        var uriBuilder = new UriBuilder("http://localhost/api/v1/weatherforecast");
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        if (!string.IsNullOrWhiteSpace(filter))
            query["$filter"] = filter;
        if (!string.IsNullOrWhiteSpace(expand))
            query["$expand"] = expand;
        if (!string.IsNullOrWhiteSpace(orderBy))
            query["$orderBy"] = orderBy;
        if (top is not null)
            query["$top"] = top.ToString();
        if (skip is not null)
            query["$skip"] = skip.ToString();
        uriBuilder.Query = query.ToString();
        var expectedTop = top ?? WeatherForecastController.DefaultPageSize;
        var expectedSkip = skip ?? 0;

        // Act
        var response = await client.GetAsync(uriBuilder.Uri);

        // Assert
        query["$skip"] = (expectedTop + expectedSkip).ToString();
        uriBuilder.Query = query.ToString();
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ODataResultSet<WeatherForecast>>();
        Assert.NotNull(result);
        Assert.IsType<ODataResultSet<WeatherForecast>>(result);
        Assert.NotNull(result!.Elements);
        Assert.Equal(expectedTop, result.Elements.Count);
        Assert.Equal(expectedSkip, result.Offset);
        Assert.NotNull(result.NextLink);
    }
}