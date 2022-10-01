using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics;
using System.Runtime.Serialization;

namespace ConceptBed.Data.Models;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
[DataContract]
[DebuggerDisplay("{" + nameof(GetDebuggerDisplay) + "(),nq}")]
public class WeatherLogEntry
{
    public int Id { get; set; }

    public Guid ForecastId { get; set; }

    [DataMember]
    public DateTime Date { get; set; }

    [DataMember]
    public int Delta { get; set; }

    private string GetDebuggerDisplay() => ToString();

    /// <inheritdoc/>
    public override string ToString() => $"{Date}: {Delta}";

    internal class Config : IEntityTypeConfiguration<WeatherLogEntry>
    {
        public void Configure(EntityTypeBuilder<WeatherLogEntry> builder)
        {
            builder.ToTable("forecastdeltas");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            builder.Property(x => x.ForecastId).HasColumnName("forecast_id");
            builder.Property(x => x.Date).HasColumnName("date");
            builder.Property(x => x.Delta).HasColumnName("delta");
        }
    }
}