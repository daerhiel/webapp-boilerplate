using ConceptBed.Security.Requirements;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace ConceptBed.Security
{
    /// <summary>
    /// Represents a static container for the authorization requirements configured in the application.
    /// </summary>
    public static class AuthorizationRequirements
    {
        /// <summary>
        /// The authorization requirement that enforces the identity to have correct state and impersonation access.
        /// </summary>
        [AuthorizationPolicy(AuthorizationPolicies.IdentityActive)]
        [AuthorizationScopes(AuthorizationScopes.UserImpersonation)]
        public static IAuthorizationRequirement IdentityActive { get; } = new IdentityActiveRequirement();

        /// <summary>
        /// Gets the authorization scope names from the <see cref="PropertyInfo"/> that represents the authorization requirement registered.
        /// </summary>
        /// <param name="property">The <see cref="PropertyInfo"/> to get the authorization scope names from.</param>
        /// <returns>The array of authorization scope names retrieved.</returns>
        private static string[]? GetScopes(PropertyInfo property) => property.GetCustomAttribute<AuthorizationScopesAttribute>()?.Names;

        /// <summary>
        /// Gets the authorization requirement from the <see cref="PropertyInfo"/> that represents the authorization requirement registered.
        /// </summary>
        /// <param name="property">The <see cref="PropertyInfo"/> to get the authorization requirement from.</param>
        /// <returns>An authorization requirement retrieved.</returns>
        private static IAuthorizationRequirement? GetRequirement(PropertyInfo property) => property.GetValue(null) as IAuthorizationRequirement;

        /// <summary>
        /// Gets the sequence of generic metadata objects associated with a sequence of authorization policy names.
        /// </summary>
        /// <typeparam name="T">The type of metadata object to get.</typeparam>
        /// <param name="policyNames">The sequence of the authorization policy names to get the metadata for.</param>
        /// <param name="projector">The projection delegate that converts a <see cref="PropertyInfo"/> holding the authorization to a metadata object.</param>
        /// <returns>A sequence of the metadata objects retrieved.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="policyNames"/> or <paramref name="projector"/> is null.</exception>
        private static IEnumerable<T> Get<T>(IEnumerable<string?> policyNames, Func<PropertyInfo, T?> projector)
        {
            if (policyNames is null)
                throw new ArgumentNullException(nameof(policyNames));
            if (projector is null)
                throw new ArgumentNullException(nameof(projector));

            foreach (var property in typeof(AuthorizationRequirements).GetProperties())
                switch (property.GetCustomAttribute<AuthorizationPolicyAttribute>())
                {
                    case { Name: var name } when policyNames.Contains(name):
                        if (projector(property) is T projection)
                            yield return projection;
                        break;
                }
        }

        /// <summary>
        /// Gets a sequence of an authorization requirements associated with any of the specified authorization policy names.
        /// </summary>
        /// <param name="policyNames">The array of authorization policy names to get the authorization requirements for.</param>
        /// <returns>A sequence of the authorization requirements retrieved.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="policyNames"/> is null.</exception>
        public static IEnumerable<IAuthorizationRequirement> Get(params string?[] policyNames) => Get(policyNames, GetRequirement);

        /// <summary>
        /// Gets a sequence of an authorization scope names associated with any of the specified authorization policy names.
        /// </summary>
        /// <param name="policyNames">The array of authorization policy names to get the authorization scope names for.</param>
        /// <returns>A sequence of the authorization scope names retrieved.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="policyNames"/> is null.</exception>
        public static IEnumerable<string> GetScopes(params string?[] policyNames) => Get(policyNames, GetScopes).SelectMany(x => x).Distinct();
    }
}