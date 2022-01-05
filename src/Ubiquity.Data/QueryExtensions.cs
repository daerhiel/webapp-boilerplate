using System.Linq.Expressions;

namespace Ubiquity.Data
{
    /// <summary>
    /// Represents the extension method container class for the <see cref="IQueryable"/> extensions.
    /// </summary>
    public static partial class QueryExtensions
    {
        /// <summary>
        /// Filters a sequence of values based on a sequence of predicates.
        /// </summary>
        /// <typeparam name="TSource">The type of the elements of source.</typeparam>
        /// <param name="source">An <see cref="IQueryable{T}"/> to filter</param>
        /// <param name="predicates">A sequence of functions to test each element for a condition.</param>
        /// <returns>An <see cref="IQueryable{T}"/> that contains elements from the input sequence that satisfy the condition specified by predicate.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="source"/> is null.</exception>
        public static IQueryable<TSource> Where<TSource>(this IQueryable<TSource> source, params Expression<Func<TSource, bool>>?[] predicates)
        {
            if (source is null)
                throw new ArgumentNullException(nameof(source), $"The sequence source cannot be null.");

            foreach (var predicate in predicates ?? Array.Empty<Expression<Func<TSource, bool>>>())
                source = predicate switch
                {
                    Expression<Func<TSource, bool>> condition => Queryable.Where(source, predicate),
                    _ => source
                };
            return source;
        }
    }
}