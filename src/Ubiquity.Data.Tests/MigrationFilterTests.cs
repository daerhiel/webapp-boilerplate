using Microsoft.AspNetCore.Builder;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Diagnostics;

namespace Ubiquity.Data.Tests;

public class MigrationFilterTests
{
    protected ITestOutputHelper Output { get; }

    public MigrationFilterTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Ctor()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();

        // Act
        var result = new MigrationFilter<DbContext>(serviceProvider.Object);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public void Configure_InMemory()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var services = new ServiceCollection();
        services.AddDbContext<DbContext>(builder => builder.UseInMemoryDatabase("DbContext"));
        var serviceProvider = services.BuildServiceProvider();
        var migrator = new MigrationFilter<DbContext>(serviceProvider);

        // Act
        var result = migrator.Configure(expectedResult);

        // Assert
        Assert.Equal(expectedResult, result);

        static void expectedResult(IApplicationBuilder builder)
        {
        }
    }

    [Fact]
    public void Configure_SqliteMemory()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var services = new ServiceCollection();
        services.AddDbContext<DbContext>(builder =>
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();
            builder.UseSqlite(connection);
        });
        var serviceProvider = services.BuildServiceProvider();
        var migrator = new MigrationFilter<DbContext>(serviceProvider);

        // Act
        var result = migrator.Configure(expectedResult);

        // Assert
        Assert.Equal(expectedResult, result);

        static void expectedResult(IApplicationBuilder builder)
        {
        }
    }
}