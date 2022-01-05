using System.Numerics;
using System.Security.Cryptography;

namespace Ubiquity.Abstractions
{
    /// <summary>
    /// The static string trace identifier generator that creates the 62-base random strings.
    /// </summary>
    public static partial class TraceIdentifier
    {
        private static readonly RandomNumberGenerator _random = RandomNumberGenerator.Create();
        private static readonly char[] _set = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();
        private static readonly double _rate = (int)Math.Log2(_set.Length) / 8D; // Mwa-ha-ha-ha! >8D

        /// <summary>
        /// Creates the 62-base random string of a specified length.
        /// </summary>
        /// <param name="length">The length of a string to create.</param>
        /// <returns>The 62-base random string created.</returns>
        /// <exception cref="ArgumentOutOfRangeException">When <paramref name="length"/> is not greater than zero.</exception>
        public static string GenerateId(int length = 8)
        {
            if (length is <= 0)
                throw new ArgumentOutOfRangeException(nameof(length), $"The length should be positive: {length}.");

            var result = new char[length];
            var buffer = new byte[(int)Math.Round(length * _rate, MidpointRounding.ToPositiveInfinity)];
            _random.GetNonZeroBytes(buffer);

            var digit = BigInteger.Zero;
            var value = new BigInteger(buffer, isUnsigned: true);
            var index = result.Length;
            while (index > 0)
            {
                if (!value.IsZero || !digit.IsZero)
                    value = BigInteger.DivRem(value, _set.Length, out digit);
                result[--index] = _set[(int)digit];
            }

            return new string(result);
        }
    }
}