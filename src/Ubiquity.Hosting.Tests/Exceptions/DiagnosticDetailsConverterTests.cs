using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Diagnostics;
using Ubiquity.Hosting.Exceptions;
using Xunit;
using Xunit.Abstractions;

namespace Ubiquity.Hosting.Tests.Exceptions;

public class DiagnosticDetailsConverterTests
{
    private readonly JsonSerializerSettings _settings = new()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver()
    };

    protected ITestOutputHelper Output { get; }

    public DiagnosticDetailsConverterTests(ITestOutputHelper output)
    {
        Output = output ?? throw new ArgumentNullException(nameof(output));
    }

    [Theory]
    [InlineData("01", nameof(DiagnosticDetails.Type), "https://test", "{\"type\":\"https://test\"}")]
    [InlineData("02", nameof(DiagnosticDetails.Title), "Bad request", "{\"title\":\"Bad request\"}")]
    [InlineData("03", nameof(DiagnosticDetails.Status), 400, "{\"status\":400}")]
    [InlineData("04", nameof(DiagnosticDetails.Detail), "Bad name", "{\"detail\":\"Bad name\"}")]
    [InlineData("05", nameof(DiagnosticDetails.Instance), "https://test/api", "{\"instance\":\"https://test/api\"}")]
    [InlineData("07", "trackId", "00-000000-00", "{\"trackId\":\"00-000000-00\"}")]
    public void Serialize(string testId, string inputName, object inputValue, string expected)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange
        var instance = new DiagnosticDetails();
        var property = typeof(DiagnosticDetails).GetProperty(inputName);
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
    [InlineData("01", "{ type: 'https://test' }", nameof(DiagnosticDetails.Type), "https://test")]
    [InlineData("02", "{ title: 'Bad request' }", nameof(DiagnosticDetails.Title), "Bad request")]
    [InlineData("03", "{ status: 400 }", nameof(DiagnosticDetails.Status), 400)]
    [InlineData("04", "{ detail: 'Bad name' }", nameof(DiagnosticDetails.Detail), "Bad name")]
    [InlineData("05", "{ instance: 'https://test/api' }", nameof(DiagnosticDetails.Instance), "https://test/api")]
    [InlineData("06", "{ trackId: '00-000000-00' }", "trackId", "00-000000-00")]
    public void Deserialize(string testId, string input, string expectedName, object expectedValue)
    {
        Output.WriteLine($"Testing {new StackTrace().GetFrame(0)?.GetMethod()?.Name}: {testId}.");

        // Arrange

        // Act
        var actual = JsonConvert.DeserializeObject<DiagnosticDetails>(input, _settings);

        // Assert
        var property = typeof(DiagnosticDetails).GetProperty(expectedName);
        var actualValue = property?.GetValue(actual, null) ?? actual?.Extensions[expectedName];

        Assert.Equal(expectedValue, actualValue);
    }
}