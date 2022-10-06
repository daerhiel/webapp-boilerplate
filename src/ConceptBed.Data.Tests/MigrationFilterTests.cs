using Microsoft.AspNetCore.Builder;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Ubiquity.Data;

namespace ConceptBed.Data.Tests;

public class MigrationFilterTests
{
    protected ITestOutputHelper Output { get; }

    public MigrationFilterTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Fact]
    public void Configure_SqliteMemory()
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}.");

        // Arrange
        var services = new ServiceCollection();
        services.AddDbContext<ConceptContext>(builder =>
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();
            builder.UseSqlite(connection);
        });
        var serviceProvider = services.BuildServiceProvider();
        var migrator = new MigrationFilter<ConceptContext>(serviceProvider);

        // Act
        var actual = migrator.Configure(expected);

        // Assert
        Assert.Equal(expected, actual);

        static void expected(IApplicationBuilder builder)
        {
        }
    }
}