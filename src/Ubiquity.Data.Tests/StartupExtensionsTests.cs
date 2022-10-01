using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
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
    public void AddSqliteContext(string id, bool enforceMigration, bool migrate)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var connectionStrings = "ConnectionStrings";
        var connectionStringName = "TestConnection";
        var connectionString = "Connection String Value";

        var services = new ServiceCollection();
        var configuration = new Mock<IConfiguration>();
        configuration.Setup(x => x.GetSection(It.Is(connectionStrings, StringComparer.Ordinal))).Returns(() =>
        {
            var section = new Mock<IConfigurationSection>();
            section.Setup(x => x[It.Is(connectionStringName, StringComparer.Ordinal)]).Returns(connectionString);
            return section.Object;
        });
        configuration.Setup(x => x.GetSection(It.Is(StorageConfiguration.Storage, StringComparer.Ordinal))).Returns(() =>
        {
            var section = new Mock<IConfigurationSection>();
            section.Setup(x => x[It.Is(nameof(StorageConfiguration.EnforceMigration), StringComparer.Ordinal)]).Returns(enforceMigration.ToString());
            return section.Object;
        });

        // Act
        var actual = StartupExtensions.AddSqliteContext<DbContext>(services, configuration.Object, connectionStringName, migrate);
        var serviceProvider = actual.BuildServiceProvider();

        // Assert
        Assert.Equal(services, actual);
        Assert.IsType<DbContext>(serviceProvider.GetService<DbContext>());
        if (migrate && !Debugger.IsAttached)
            Assert.IsType<MigrationFilter<DbContext>>(serviceProvider.GetService<IStartupFilter>());    
        else
            Assert.Null(serviceProvider.GetService<IStartupFilter>());    
    }

    [Theory]
    [InlineData("01r", false, false)]
    [InlineData("02r", false, true)]
    [InlineData("03e", true, false)]
    [InlineData("04e", true, true)]
    public void AddSqlServerContext(string id, bool enforceMigration, bool migrate)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var connectionStrings = "ConnectionStrings";
        var connectionStringName = "TestConnection";
        var connectionString = "Connection String Value";

        var services = new ServiceCollection();
        var configuration = new Mock<IConfiguration>();
        configuration.Setup(x => x.GetSection(It.Is(connectionStrings, StringComparer.Ordinal))).Returns(() =>
        {
            var section = new Mock<IConfigurationSection>();
            section.Setup(x => x[It.Is(connectionStringName, StringComparer.Ordinal)]).Returns(connectionString);
            return section.Object;
        });
        configuration.Setup(x => x.GetSection(It.Is(StorageConfiguration.Storage, StringComparer.Ordinal))).Returns(() =>
        {
            var section = new Mock<IConfigurationSection>();
            section.Setup(x => x[It.Is(nameof(StorageConfiguration.EnforceMigration), StringComparer.Ordinal)]).Returns(enforceMigration.ToString());
            return section.Object;
        });

        // Act
        var actual = StartupExtensions.AddSqlServerContext<DbContext>(services, configuration.Object, connectionStringName, migrate);
        var serviceProvider = actual.BuildServiceProvider();

        // Assert
        Assert.Equal(services, actual);
        Assert.IsType<DbContext>(serviceProvider.GetService<DbContext>());
        if (migrate && !Debugger.IsAttached)
            Assert.IsType<MigrationFilter<DbContext>>(serviceProvider.GetService<IStartupFilter>());    
        else
            Assert.Null(serviceProvider.GetService<IStartupFilter>());    
    }
}