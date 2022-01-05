using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Runtime.Serialization;
using Ubiquity.Abstractions;

namespace ConceptBed.Data.Models
{
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    [DataContract]
    [DebuggerDisplay("{" + nameof(GetDebuggerDisplay) + "(),nq}")]
    public class WeatherForecast
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public DateTime Date { get; set; }

        [DataMember]
        public int Temperature { get; set; }

        [DataMember]
        public string? Summary { get; set; }

        [DataMember]
        public virtual ICollection<WeatherLogEntry>? History { get; set; }

        [DataMember]
        public WeatherForecastStatus Status { get; set; }

        private string GetDebuggerDisplay() => ToString();

        /// <inheritdoc/>
        public override string ToString()
        {
            return string.Join(" ", new[]
            {
                Summary.GetString(),
                Id.GetString(x => $"({x})"),
            }.OfType<string>());
        }

        public static Expression<Func<WeatherForecast, bool>> IsId(Guid id) =>
            x => x.Id == id;

        public static Expression<Func<WeatherForecast, bool>> IsSummary(string summary) =>
            x => EF.Functions.Collate(x.Summary, ConceptContext.CaseInsensitive) == summary;

        public static Expression<Func<WeatherForecast, bool>>?[] IsMatching(WeatherForecast forecast) => new[]
        {
            forecast?.Id.ToExpression(IsId),
            forecast?.Summary.ToExpression(IsSummary)
        };

        internal class Config : IEntityTypeConfiguration<WeatherForecast>
        {
            public void Configure(EntityTypeBuilder<WeatherForecast> builder)
            {
                builder.ToTable("forecasts");
                builder.HasKey(x => x.Id);
                builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
                builder.Property(x => x.Date).HasColumnName("date");
                builder.Property(x => x.Temperature).HasColumnName("temperature");
                builder.Property(x => x.Summary).HasColumnName("summary").HasMaxLength(512).UseCollation(ConceptContext.CaseInsensitive).IsRequired();
                builder.Property(x => x.Status).HasColumnName("status");

                builder.HasMany(x => x.History).WithOne().HasPrincipalKey(x => x.Id).HasForeignKey(x => x.ForecastId);
            }
        }
    }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}