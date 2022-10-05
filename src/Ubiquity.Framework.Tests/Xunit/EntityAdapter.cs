using System.Linq.Expressions;
using Ubiquity.Data.Tests.Xunit;

namespace Ubiquity.Framework.Tests.Xunit;

public class EntityAdapter : Adapter<int, Entity, EntityUnitOfWork>
{
    public EntityAdapter(EntityUnitOfWork unitOfWork)
        : base(unitOfWork)
    {
    }

    protected override Func<IQueryable<Entity>, IOrderedQueryable<Entity>> GetDefaultOrderBy() =>
        query => query.OrderBy(x => x.Id);

    protected override Expression<Func<Entity, bool>> GetSearchPredicate(string query) =>
        x => x.Name!.Contains(query);
}