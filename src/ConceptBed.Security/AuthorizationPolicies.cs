namespace ConceptBed.Security
{
    /// <summary>
    /// Represents a static container for the authorization policy names configured in the application.
    /// </summary>
    public static class AuthorizationPolicies
    {
        /// <summary>
        /// The authorization policy that requires an identity to be in an active state.
        /// </summary>
        public const string IdentityActive = nameof(IdentityActive);

        /// <summary>
        /// The authorization policy that checks if a current identity can create the specified entity.
        /// </summary>
        public const string CanCreateEntity = nameof(CanCreateEntity);

        /// <summary>
        /// The authorization policy that checks if a current identity can update the specified entity.
        /// </summary>
        public const string CanUpdateEntity = nameof(CanUpdateEntity);

        /// <summary>
        /// Gets a sequence of the availale authorization policy names configured.
        /// </summary>
        /// <returns>A sequence of the availale authorization policy names retrieved.</returns>
        public static IEnumerable<string> Get() => typeof(AuthorizationPolicies)
            .GetFields()
            .Select(x => x.Name);
    }
}