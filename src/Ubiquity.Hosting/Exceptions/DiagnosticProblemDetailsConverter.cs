using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ubiquity.Hosting.Exceptions;

/// <summary>
/// A RFC 7807 compliant <see cref="JsonConverter"/> for <see cref="DiagnosticProblemDetails"/>.
/// </summary>
public sealed class DiagnosticProblemDetailsConverter : JsonConverter<DiagnosticProblemDetails>
{
    /// <inheritdoc />
    public override DiagnosticProblemDetails? ReadJson(JsonReader reader, Type objectType, DiagnosticProblemDetails? existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (existingValue is null || !hasExistingValue)
            existingValue = new DiagnosticProblemDetails();

        if (serializer.ContractResolver is not DefaultContractResolver { NamingStrategy: NamingStrategy namingStrategy })
            throw new InvalidOperationException("The contract resolver is not supported.");

        if (reader.TokenType != JsonToken.StartObject)
            throw new JsonException("Unexcepted end when reading JSON.");

        while (reader.Read() && reader.TokenType != JsonToken.EndObject)
        {
            if (reader.TokenType == JsonToken.PropertyName)
            {
                switch (reader.Value)
                {
                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticProblemDetails.Type), false):
                        existingValue.Type = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticProblemDetails.Title), false):
                        existingValue.Title = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticProblemDetails.Status), false):
                        existingValue.Status = reader.ReadAsInt32();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticProblemDetails.Detail), false):
                        existingValue.Detail = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticProblemDetails.Instance), false):
                        existingValue.Instance = reader.ReadAsString();
                        break;

                    case string name:
                        do
                            reader.Read();
                        while (reader.TokenType is JsonToken.None or JsonToken.Comment);
                        existingValue.Extensions[name] = serializer.Deserialize<object>(reader);
                        break;
                }
            }
        }

        if (reader.TokenType != JsonToken.EndObject)
            throw new JsonException("Unexcepted end when reading JSON.");

        return existingValue;
    }

    /// <inheritdoc />
    public override void WriteJson(JsonWriter writer, DiagnosticProblemDetails? value, JsonSerializer serializer)
    {
        if (serializer.ContractResolver is not DefaultContractResolver { NamingStrategy: NamingStrategy namingStrategy })
            throw new InvalidOperationException("The contract resolver is not supported.");

        if (value is not null)
        {
            writer.WriteStartObject();
            WriteProperty(writer, namingStrategy, nameof(DiagnosticProblemDetails.Type), value.Type);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticProblemDetails.Title), value.Title);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticProblemDetails.Status), value.Status);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticProblemDetails.Detail), value.Detail);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticProblemDetails.Instance), value.Instance);

            if (value.Extensions is IDictionary<string, object?> extensions)
            {
                foreach (var (propertyName, propertyValue) in extensions)
                    WriteProperty(writer, namingStrategy, propertyName, propertyValue);
            }

            if (value.Exception is not null)
            {
                writer.WritePropertyName(namingStrategy.GetPropertyName(nameof(value.Exception), false));
                serializer.Serialize(writer, value.Exception);
            }

            writer.WriteEndObject();
        }
        else
            writer.WriteNull();

        static void WriteProperty<T>(JsonWriter writer, NamingStrategy namingStrategy, string name, T value)
        {
            if (value is not null)
            {
                writer.WritePropertyName(namingStrategy.GetPropertyName(name, false));
                writer.WriteValue(value);
            }
        }
    }
}