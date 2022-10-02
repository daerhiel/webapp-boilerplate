using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ubiquity.Hosting.Exceptions;

/// <summary>
/// A RFC 7807 compliant <see cref="JsonConverter"/> for <see cref="DiagnosticDetails"/>.
/// </summary>
public sealed class DiagnosticDetailsConverter : JsonConverter<DiagnosticDetails>
{
    /// <inheritdoc />
    public override DiagnosticDetails? ReadJson(JsonReader reader, Type objectType, DiagnosticDetails? existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (existingValue is null || !hasExistingValue)
            existingValue = new DiagnosticDetails();

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
                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticDetails.Type), false):
                        existingValue.Type = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticDetails.Title), false):
                        existingValue.Title = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticDetails.Status), false):
                        existingValue.Status = reader.ReadAsInt32();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticDetails.Detail), false):
                        existingValue.Detail = reader.ReadAsString();
                        break;

                    case string name when name == namingStrategy.GetPropertyName(nameof(DiagnosticDetails.Instance), false):
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
            throw new JsonException("Unexpected end when reading JSON.");

        return existingValue;
    }

    /// <inheritdoc />
    public override void WriteJson(JsonWriter writer, DiagnosticDetails? value, JsonSerializer serializer)
    {
        if (serializer.ContractResolver is not DefaultContractResolver { NamingStrategy: NamingStrategy namingStrategy })
            throw new InvalidOperationException("The contract resolver is not supported.");

        if (value is not null)
        {
            writer.WriteStartObject();
            WriteProperty(writer, namingStrategy, nameof(DiagnosticDetails.Type), value.Type);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticDetails.Title), value.Title);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticDetails.Status), value.Status);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticDetails.Detail), value.Detail);
            WriteProperty(writer, namingStrategy, nameof(DiagnosticDetails.Instance), value.Instance);

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