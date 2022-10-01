using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Ubiquity.Hosting.Options;

/// <summary>
/// Represents an <see cref="IConfigureOptions{CorsOptions}"/> configurator object that sets up the respective service.
/// </summary>
public class ConfigureCorsOptions : IConfigureOptions<CorsOptions>
{
    /// <summary>
    /// The name of a configuration section that contains cors policy data.
    /// </summary>
    public const string SectionName = nameof(Microsoft.AspNetCore.Cors);

    /// <summary>
    /// The name of a tha contains default Cors policy name.
    /// </summary>
    public const string DefaultPolicyName = "Default";

    /// <summary>
    /// The name of a tha contains default Cors policy name.
    /// </summary>
    public const string PolicyContainerName = "Policies";

    /// <summary>
    /// The set of key/value application configuration properties.
    /// </summary>
    public IConfiguration Configuration { get; }

    /// <summary>
    /// Initializes the new instance of an <see cref="IConfigureOptions{CorsOptions}"/> configurator object.
    /// </summary>
    /// <param name="configuration">The set of key/value application configuration properties.</param>
    /// <exception cref="ArgumentNullException">When mandatory dependencies are null.</exception>
    public ConfigureCorsOptions(IConfiguration configuration)
    {
        Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    /// <inheritdoc/>
    public void Configure(CorsOptions options)
    {
        var section = Configuration.GetSection(SectionName);
        if (section.GetSection(DefaultPolicyName).Get<CorsPolicy>() is CorsPolicy defaultPolicy)
        {
            options.AddDefaultPolicy(defaultPolicy);
        }

        if (section.GetSection(PolicyContainerName).Get<Dictionary<string, CorsPolicy>>() is { } policyIndex)
        {
            foreach (var (policyName, policy) in policyIndex)
            {
                if (!string.IsNullOrEmpty(policyName) && policy is not null)
                    options.AddPolicy(policyName, policy);
            }
        }
    }
}