﻿using Microsoft.AspNetCore.Builder;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Diagnostics;
using Xunit;
using Xunit.Abstractions;

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
        var actual = new MigrationFilter<DbContext>(serviceProvider.Object);

        // Assert
        Assert.NotNull(actual);
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
        var actual = migrator.Configure(expected);

        // Assert
        Assert.Equal(expected, actual);

        static void expected(IApplicationBuilder builder)
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
        var actual = migrator.Configure(expected);

        // Assert
        Assert.Equal(expected, actual);

        static void expected(IApplicationBuilder builder)
        {
        }
    }
}