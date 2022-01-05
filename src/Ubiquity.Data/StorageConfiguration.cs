namespace Ubiquity.Data
{
    /// <summary>
    /// Represents the storage configuration object that contains settings for confoguration section.
    /// </summary>
    public class StorageConfiguration
    {
        /// <summary>
        /// The default name of a configuration section.
        /// </summary>
        public const string Storage = nameof(Storage);

        /// <summary>
        /// True if the data migration is required to be applied on application startup; otherwise, false.
        /// </summary>
        public bool EnforceMigration { get; set; }
    }
}