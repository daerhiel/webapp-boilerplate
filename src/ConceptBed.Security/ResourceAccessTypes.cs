namespace ConceptBed.Security
{
    /// <summary>
    /// Represents the resource authorization access type set.
    /// </summary>
    [Flags]
    public enum ResourceAccessTypes
    {
        /// <summary>
        /// The read access to a resource is requedted or allowed.
        /// </summary>
        Read = 0x00000001,

        /// <summary>
        /// The create access to a resource is requedted or allowed.
        /// </summary>
        Create = 0x00000002,

        /// <summary>
        /// The update access to a resource is requedted or allowed.
        /// </summary>
        Update = 0x00000004,

        /// <summary>
        /// The remove access to a resource is requedted or allowed.
        /// </summary>
        Remove = 0x00000008
    }
}