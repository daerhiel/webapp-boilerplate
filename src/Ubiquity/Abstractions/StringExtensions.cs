namespace Ubiquity.Abstractions
{
    /// <summary>
    /// Represents the extension method container class for the <see cref="string"/> extensions.
    /// </summary>
    public static partial class StringExtensions
    {
        /// <summary>
        /// Gets the string representation of a <typeparamref name="T"/> value if it is not null.
        /// </summary>
        /// <typeparam name="T">The type of a value.</typeparam>
        /// <param name="value">The value to get the string representation for.</param>
        /// <param name="fallback">The fallback value if the criteria is not met.</param>
        /// <returns>The string representation received.</returns>
        public static string? GetString<T>(this T? value, string? fallback = null)
        {
            if(value is null)
                return fallback;
            else
                return value.ToString();
        }

        /// <summary>
        /// Gets the string representation of a <see cref="string"/> value if it is not null or whitespace.
        /// </summary>
        /// <param name="value">The value to get the string representation for.</param>
        /// <param name="fallback">The fallback value if the criteria is not met.</param>
        /// <returns>The string representation received.</returns>
        public static string? GetString(this string? value, string? fallback = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return fallback;
            else
                return value;
        }

        /// <summary>
        /// Gets the formatted string representation of a <typeparamref name="T"/> value if it is not null.
        /// </summary>
        /// <typeparam name="T">The type of a value.</typeparam>
        /// <param name="value">The value to get the string representation for.</param>
        /// <param name="formatter">The string formatter delegate that creates the string representation.</param>
        /// <param name="fallback">The fallback value if the criteria is not met.</param>
        /// <returns>The string representation received.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="formatter"/> is null.</exception>
        public static string? GetString<T>(this T? value, Func<T, string> formatter, string? fallback = null)
        {
            if (formatter is null)
                throw new ArgumentNullException(nameof(formatter));

            if (value is null)
                return fallback;
            else
                return formatter(value);
        }

        /// <summary>
        /// Gets the formatted string representation of a <see cref="string"/> value if it is not null or whitespace.
        /// </summary>
        /// <param name="value">The value to get the string representation for.</param>
        /// <param name="formatter">The string formatter delegate that creates the string representation.</param>
        /// <param name="fallback">The fallback value if the criteria is not met.</param>
        /// <returns>The string representation received.</returns>
        /// <exception cref="ArgumentNullException">When <paramref name="formatter"/> is null.</exception>
        public static string? GetString(this string? value, Func<string, string> formatter, string? fallback = null)
        {
            if (formatter is null)
                throw new ArgumentNullException(nameof(formatter));

            if (string.IsNullOrWhiteSpace(value))
                return fallback;
            else
                return formatter(value);
        }
    }
}