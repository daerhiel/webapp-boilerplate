using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Ubiquity.Data.Tests;

public class StartupExtensionsTests
{
    protected ITestOutputHelper Output { get; }

    public StartupExtensionsTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01r", false, false)]
    [InlineData("02r", false, true)]
    [InlineData("03e", true, false)]
    [InlineData("04e", true, true)]
    public void AddSqliteContext(string testId, bool enforceMigration, bool migrate)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var connectionStrings = "ConnectionStrings";
        var connectionStringName = "TestConnection";
        var connectionString = "Connection String Value";

        var services = new ServiceCollection().AddOptions();
        services.AddOptions<StorageConfiguration>();
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
        {
            { $"{connectionStrings}:{connectionStringName}", connectionString },
            { $"{StorageConfiguration.Storage}:{nameof(StorageConfiguration.EnforceMigration)}", enforceMigration.ToString() }
        }).Build();

        // Act
        var result = StartupExtensions.AddSqliteContext<DbContext>(services, configuration, connectionStringName, migrate);
        var serviceProvider = result.BuildServiceProvider();

        // Assert
        Assert.Equal(services, result);
        Assert.IsType<DbContext>(serviceProvider.GetService<DbContext>());
        if (migrate && (!Debugger.IsAttached || enforceMigration))
            Assert.IsType<MigrationFilter<DbContext>>(serviceProvider.GetService<IStartupFilter>());    
        else
            Assert.Null(serviceProvider.GetService<IStartupFilter>());    
    }

    [Theory]
    [InlineData("01r", false, false)]
    [InlineData("02r", false, true)]
    [InlineData("03e", true, false)]
    [InlineData("04e", true, true)]
    public void AddSqlServerContext(string testId, bool enforceMigration, bool migrate)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var connectionStrings = "ConnectionStrings";
        var connectionStringName = "TestConnection";
        var connectionString = "Connection String Value";

        var services = new ServiceCollection().AddOptions();
        services.AddOptions<StorageConfiguration>();
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
        {
            { $"{connectionStrings}:{connectionStringName}", connectionString },
            { $"{StorageConfiguration.Storage}:{nameof(StorageConfiguration.EnforceMigration)}", enforceMigration.ToString() }
        }).Build();

        // Act
        var result = StartupExtensions.AddSqlServerContext<DbContext>(services, configuration, connectionStringName, migrate);
        var serviceProvider = result.BuildServiceProvider();

        // Assert
        Assert.Equal(services, result);
        Assert.IsType<DbContext>(serviceProvider.GetService<DbContext>());
        if (migrate && (!Debugger.IsAttached || enforceMigration))
            Assert.IsType<MigrationFilter<DbContext>>(serviceProvider.GetService<IStartupFilter>());    
        else
            Assert.Null(serviceProvider.GetService<IStartupFilter>());    
    }
}