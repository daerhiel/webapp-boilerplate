using Microsoft.EntityFrameworkCore;

namespace Ubiquity.Data;

/// <summary>
/// Represents the interface to a database context part of unit fo work.
/// </summary>
public interface IUnitOfWorkContext
{
    /// <summary>
    /// The database context provided by the unit of work.
    /// </summary>
    DbContext DbContext { get; }

    /// <summary>
    /// The interface to a dependency injection service provider instance that locates a service object.
    /// </summary>
    IServiceProvider ServiceProvider { get; }
}