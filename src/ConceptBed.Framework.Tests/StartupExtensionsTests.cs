using ConceptBed.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Ubiquity.Data;
using Xunit;
using Xunit.Abstractions;

namespace ConceptBed.Framework.Tests;

public class StartupExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    public StartupExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", false)]
    [InlineData("02", true)]
    public void AddSqliteContext(string testId, bool enforceMigration)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var connectionStrings = "ConnectionStrings";
        var connectionString = "Connection String Value";

        var services = new ServiceCollection().AddOptions();
        services.AddOptions<StorageConfiguration>();
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
        {
            { $"{connectionStrings}:{StartupExtensions.DbSectionName}", connectionString },
            { $"{StorageConfiguration.Storage}:{nameof(StorageConfiguration.EnforceMigration)}", enforceMigration.ToString() }
        }).Build();

        // Act
        var result = services.AddFramework(configuration);
        var serviceProvider = result.BuildServiceProvider();

        // Assert
        Assert.Equal(services, result);
        Assert.IsType<WeatherForecastAdapter>(serviceProvider.GetService<IWeatherForecastAdapter>());
        Assert.IsType<ConceptContext>(serviceProvider.GetService<ConceptContext>());
        if (!Debugger.IsAttached || enforceMigration)
            Assert.IsType<MigrationFilter<ConceptContext>>(serviceProvider.GetService<IStartupFilter>());
        else
            Assert.Null(serviceProvider.GetService<IStartupFilter>());
    }
}