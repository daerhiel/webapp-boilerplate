using Azure.Identity;
using ConceptBed.Framework;
using ConceptBed.OpenApi;
using ConceptBed.OpenData;
using ConceptBed.Security.Options;
using ConceptBed.Security.Requirements;
using ConceptBed.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.NewtonsoftJson;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using Ubiquity.Hosting;
using Ubiquity.Hosting.Options;

using GraphServiceClient = Microsoft.Graph.GraphServiceClient;

var builder = WebApplication.CreateBuilder(args);

// Set up the application context.
builder.WebHost.CaptureStartupErrors(true);

// Set the application configuration structure.
var configuration = builder.Configuration;
configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);
configuration.AddJsonFile("appsettings.Context.json", optional: true, reloadOnChange: true);

// Set up logging services and telemetry logging configuration.
builder.Logging.AddSimpleConsole(config => config.IncludeScopes = true);
builder.Logging.AddEventSourceLogger();
builder.Logging.AddApplicationInsights(options => options.TrackExceptionsAsExceptionTelemetry = true);

// Add the authentication services and options.
var scopes = new HashSet<string>(new[] { "User.Read" });
builder.Services.AddMicrosoftIdentityWebApiAuthentication(configuration)
    .EnableTokenAcquisitionToCallDownstreamApi()
    .AddDistributedTokenCaches()
    .AddMicrosoftGraph(authenticationProvider =>
    {
        var options = configuration.GetSection(Constants.AzureAd).Get<ConfidentialClientApplicationOptions>();
        return new GraphServiceClient(new ClientSecretCredential(options.TenantId, options.ClientId, options.ClientSecret));
    }, scopes);
builder.Services.AddTransient<IConfigurationManager<OpenIdConnectConfiguration>>(serviceProvider =>
{
    var options = configuration.GetSection(Constants.AzureAd).Get<PublicClientApplicationOptions>();
    var discoveryUrl = new Uri(new Uri(options.Instance), $"{options.TenantId}/v2.0/.well-known/openid-configuration");
    return new ConfigurationManager<OpenIdConnectConfiguration>(discoveryUrl.AbsoluteUri, new OpenIdConnectConfigurationRetriever());
});

// Add the authorization services and options.
builder.Services.AddTransient<IConfigureOptions<AuthorizationOptions>, ConfigureAuthorizationOptions>();
builder.Services.AddAuthorization();
builder.Services.AddRequiredScopeAuthorization();
builder.Services.AddSingleton<IAuthorizationHandler, IdentityActiveRequirementHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, ResourceAccessRequirementHandler>();

// Add Http services and pipeline related middleware.
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IConfigureOptions<CorsOptions>, ConfigureCorsOptions>();
builder.Services.AddTransient<IConfigureOptions<RouteOptions>, ConfigureRouteOptions>();
builder.Services.AddTransient<IConfigureOptions<MvcOptions>, ConfigureMvcOptions>();
builder.Services.AddTransient<IConfigureOptions<MvcNewtonsoftJsonOptions>, ConfigureMvcNewtonsoftJsonOptions>();
builder.Services.AddTransient<IConfigureOptions<ApiVersioningOptions>, ConfigureApiVersioningOptions>();
builder.Services.AddTransient<IConfigureOptions<ApiExplorerOptions>, ConfigureApiExplorerOptions>();
builder.Services.AddTransient<IConfigureOptions<ODataOptions>, ConfigureODataOptions>();
builder.Services.AddControllersWithViews().AddNewtonsoftJson().AddOData().AddODataNewtonsoftJson(ODataPropertyMapper.Create);
builder.Services.AddApiVersioning();
builder.Services.AddVersionedApiExplorer();

// Add OpenApi documentation Http services.
builder.Services.AddTransient<IConfigureOptions<SwaggerOptions>, ConfigureSwaggerOptions>();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerGenOptions>();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerGenODataOptions>();
builder.Services.AddTransient<IConfigureOptions<SwaggerUIOptions>, ConfigureSwaggerUIOptions>();
builder.Services.AddSwaggerGen().AddSwaggerGenNewtonsoftSupport();

// Add Application Insights tetelemetry services.
builder.Services.AddApplicationInsightsTelemetry(configuration["APPINSIGHTS_CONNECTIONSTRING"]);
builder.Services.AddApplicationInsightsTelemetryChannel("Storage/Telemetry");

builder.Services.AddFramework(configuration);

var app = builder.Build();

app.UseDiagnostic();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Enable OpenApi documentation middleware.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Enable current environment Cors policy middleware.
app.UseCors(app.Environment.EnvironmentName);

// Enable authentication and authorization middleware.
app.UseAuthentication();
app.UseAuthorization();

// Enable WebApi controllers and routes.
app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html"); ;

await app.RunAsync();