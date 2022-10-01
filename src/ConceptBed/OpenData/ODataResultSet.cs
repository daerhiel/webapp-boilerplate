using Newtonsoft.Json;

namespace ConceptBed.OpenData;

/// <summary>
/// Represents the OData entity result set containing the page and transition parameters.
/// </summary>
/// <typeparam name="TEntity">The type of an entity.</typeparam>
public class ODataResultSet<TEntity>
{
    /// <summary>
    /// The current entity result set offset.
    /// </summary>
    public long Offset { get; set; }

    /// <summary>
    /// The total number of entities in dataset.
    /// </summary>
    public long Count { get; set; }

    /// <summary>
    /// The elements that entity result set contains.
    /// </summary>
    public ICollection<TEntity> Elements { get; set; } = Array.Empty<TEntity>();

    /// <summary>
    /// The the url of a next entity result set sequence.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public Uri? NextLink { get; set; }
}
