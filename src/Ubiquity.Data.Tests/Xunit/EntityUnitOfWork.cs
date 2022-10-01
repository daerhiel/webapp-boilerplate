using Arch.EntityFrameworkCore.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace Ubiquity.Data.Tests.Testing;

public class EntityUnitOfWork : UnitOfWork<EntityContext>, IUnitOfWorkContext
{
    DbContext IUnitOfWorkContext.DbContext => DbContext;

    public EntityUnitOfWork(EntityContext context)
        : base(context)
    {
    }
}