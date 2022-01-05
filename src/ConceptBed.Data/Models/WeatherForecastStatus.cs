using System.Runtime.Serialization;

namespace ConceptBed.Data.Models
{
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    [DataContract]
    public enum WeatherForecastStatus
    {
        [DataMember]
        Active,

        [DataMember]
        Leave,

        [DataMember]
        Terminated,

        [DataMember]
        Deleted
    }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}