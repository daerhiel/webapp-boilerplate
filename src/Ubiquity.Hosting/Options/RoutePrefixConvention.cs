using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Routing;

namespace Ubiquity.Hosting.Options
{
    /// <summary>
    /// Represents the <see cref="ApplicationModel"/> route convention that adds the routung prefix to controllers.
    /// </summary>
    public class RoutePrefixConvention : IApplicationModelConvention
    {
        private readonly AttributeRouteModel _model;

        /// <summary>
        /// Initializes the new instance of an <see cref="ApplicationModel"/> route convention.
        /// </summary>
        /// <param name="route">The route template provider to use as a prefix.</param>
        public RoutePrefixConvention(IRouteTemplateProvider route) => _model = new AttributeRouteModel(route);

        /// <inheritdoc/>
        public void Apply(ApplicationModel application)
        {
            foreach (var selector in application.Controllers.SelectMany(c => c.Selectors))
            {
                if (selector.AttributeRouteModel is not null)
                {
                    selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(_model, selector.AttributeRouteModel);
                }
            }
        }
    }
}