using ConceptBed.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ConceptBed.Data;

/// <inheritdoc/>
public class ConceptContext : DbContext
{
    /// <summary>
    /// The case sensitive string collation name.
    /// </summary>
    public const string CaseSensitive = "BINARY"/*"SQL_Latin1_General_CP1_CS_AS"*/;

    /// <summary>
    /// The case insensitive string collation name.
    /// </summary>
    public const string CaseInsensitive = "NOCASE"/*"SQL_Latin1_General_CP1_CI_AS"*/;

    /// <summary>
    /// The <see cref="DbSet{TEntity}"/> that holds <see cref="WeatherForecast"/> data.
    /// </summary>
    public DbSet<WeatherForecast> Forecasts { get; set; }

    /// <inheritdoc/>
    public ConceptContext(DbContextOptions<ConceptContext> options)
        : base(options)
    {
    }

    /// <inheritdoc/>
    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        base.OnConfiguring(builder);
        if (!builder.IsConfigured)
        {
        }
    }

    /// <summary>
    /// The array of summery content values.
    /// </summary>
    public static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    /// <inheritdoc/>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.UseCollation(CaseInsensitive);
        builder.ApplyConfiguration(new WeatherForecast.Config());
        builder.ApplyConfiguration(new WeatherLogEntry.Config());

        var random = new Random();
        var ids = Enumerable.Range(1, 50).Select(x => Guid.NewGuid()).ToList();

        builder.Entity<WeatherForecast>().HasData(ids.Select((id, index) => new WeatherForecast
        {
            Id = id,
            Date = DateTime.Now.AddDays(index),
            Temperature = random.Next(-20, 55),
            Summary = Summaries[random.Next(Summaries.Length)]
        }));

        builder.Entity<WeatherLogEntry>().HasData(Enumerable.Range(1, 100).Select(index => new WeatherLogEntry
        {
            Id = random.Next(),
            ForecastId = ids[random.Next(ids.Count)],
            Date = DateTime.UtcNow,
            Delta = random.Next(-10, 10)
        }));
    }
}