using ConceptBed.Data;
using ConceptBed.Data.Models;
using System.Linq.Expressions;
using Ubiquity.Framework;

namespace ConceptBed.Framework
{
    /// <inheritdoc/>
    public class WeatherForecastAdapter : Adapter<string, WeatherForecast, ConceptUnitOfWork<ConceptContext>>, IWeatherForecastAdapter
    {
        /// <inheritdoc/>
        public WeatherForecastAdapter(ConceptUnitOfWork<ConceptContext> unitOfWork)
            : base(unitOfWork)
        {
        }

        /// <inheritdoc/>
        protected override Expression<Func<WeatherForecast, bool>> GetSearchPredicate(string query)
        {
            return query switch
            {
                var value when Guid.TryParse(value, out var id) => x => x.Id == id,
                var value => x => x.Summary.Contains(query)
            };
        }

        /// <inheritdoc/>
        protected override Func<IQueryable<WeatherForecast>, IOrderedQueryable<WeatherForecast>> GetDefaultOrderBy()
        {
            return query => query.OrderBy(x => x.Id);
        }
    }
}