using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Diagnostics;
using Ubiquity.Hosting.Exceptions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Hosting.Tests.Exceptions;

public class DiagnosticProblemDetailsConverter
{
    private readonly JsonSerializerSettings _settings = new()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver()
    };

    protected ITestOutputHelper Output { get; }

    public DiagnosticProblemDetailsConverter(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", nameof(DiagnosticProblemDetails.Type), "https://test", "{\"type\":\"https://test\"}")]
    [InlineData("02", nameof(DiagnosticProblemDetails.Title), "Bad request", "{\"title\":\"Bad request\"}")]
    [InlineData("03", nameof(DiagnosticProblemDetails.Status), 400, "{\"status\":400}")]
    [InlineData("04", nameof(DiagnosticProblemDetails.Detail), "Bad name", "{\"detail\":\"Bad name\"}")]
    [InlineData("05", nameof(DiagnosticProblemDetails.Instance), "https://test/api", "{\"instance\":\"https://test/api\"}")]
    [InlineData("06", "trackId", "00-000000-00", "{\"trackId\":\"00-000000-00\"}")]
    public void Serialize(string id, string inputName, object inputValue, string expected)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange
        var instance = new DiagnosticProblemDetails();
        var property = typeof(DiagnosticProblemDetails).GetProperty(inputName);
        if (property is not null)
            property.SetValue(instance, inputValue);
        else
            instance.Extensions[inputName] = inputValue;

        // Act
        var actual = JsonConvert.SerializeObject(instance, _settings);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("01", "{ type: 'https://test' }", nameof(DiagnosticProblemDetails.Type), "https://test")]
    [InlineData("02", "{ title: 'Bad request' }", nameof(DiagnosticProblemDetails.Title), "Bad request")]
    [InlineData("03", "{ status: 400 }", nameof(DiagnosticProblemDetails.Status), 400)]
    [InlineData("04", "{ detail: 'Bad name' }", nameof(DiagnosticProblemDetails.Detail), "Bad name")]
    [InlineData("05", "{ instance: 'https://test/api' }", nameof(DiagnosticProblemDetails.Instance), "https://test/api")]
    [InlineData("06", "{ trackId: '00-000000-00' }", "trackId", "00-000000-00")]
    public void Deserialize(string id, string input, string expectedName, object expectedValue)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {id}.");

        // Arrange

        // Act
        var actual = JsonConvert.DeserializeObject<DiagnosticProblemDetails>(input, _settings);

        // Assert
        var property = typeof(DiagnosticProblemDetails).GetProperty(expectedName);
        var actualValue = property?.GetValue(actual, null) ?? actual?.Extensions[expectedName];

        Assert.Equal(expectedValue, actualValue);
    }
}