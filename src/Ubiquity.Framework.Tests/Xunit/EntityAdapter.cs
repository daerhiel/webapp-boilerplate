using System.Linq.Expressions;
using Ubiquity.Data.Tests.Testing;

namespace Ubiquity.Framework.Tests.Testing;

public class EntityAdapter : Adapter<Guid, Entity, EntityUnitOfWork>
{
    public EntityAdapter(EntityUnitOfWork unitOfWork)
        : base(unitOfWork)
    {
    }

    protected override Func<IQueryable<Entity>, IOrderedQueryable<Entity>> GetDefaultOrderBy() =>
        query => query.OrderBy(x => x.Guid);

    protected override Expression<Func<Entity, bool>> GetSearchPredicate(string query) =>
        x => x.Name!.Contains(query);
}