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
}