﻿using ConceptBed.Data.Models;
using ConceptBed.Framework;
using ConceptBed.OpenData;
using ConceptBed.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace ConceptBed.Controllers;

[ApiController, ApiVersion("1.0")]
[Route("[controller]"), Authorize(Policy = AuthorizationPolicies.IdentityActive)]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
public class WeatherForecastController : ControllerBase
{
    public const int DefaultPageSize = 3;

    private readonly IWeatherForecastAdapter _weatherForecast;

    private static readonly ODataQuerySettings _settings = new() { PageSize = DefaultPageSize, EnsureStableOrdering = true };

    public WeatherForecastController(IWeatherForecastAdapter weatherForecast) =>
        _weatherForecast = weatherForecast ?? throw new ArgumentNullException(nameof(weatherForecast));

    [HttpGet("{id}")]
    public async Task<WeatherForecast> Get([FromRoute] Guid id, CancellationToken cancellationToken) =>
        await _weatherForecast.FindAsync(id, cancellationToken: cancellationToken).ConfigureAwait(false);

    [HttpGet]
    public async Task<ODataResultSet<WeatherForecast>> Query(ODataQueryOptions<WeatherForecast> options, CancellationToken cancellationToken) =>
        await _weatherForecast.GetQuery().ToResultSetAsync(options, _settings, cancellationToken: cancellationToken);
}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member