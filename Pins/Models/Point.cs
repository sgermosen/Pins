using System.Drawing;

namespace Pins.Models
{
    public class FilterModel
    {
        public int[] RegionId { get; set; }
        public int[] MunicipioId { get; set; }
        public string Descripcion { get; set; }
        public int[] TipoDeProyectoId { get; set; }
        public int[] FaseId { get; set; }
        public int[] FondoId { get; set; }
        public int[] Id { get; set; }
    }

    public class Point
    {
        public int Id { get; set; } 
        public int RegionId { get; set; }

        public string VideoUrl { get; set; }
        public string Region { get; set; }
        public int MunicipioId { get; set; }
        public string Municipio { get; set; }
        public string Descripcion { get; set; }
        public int TipoDeProyectoId { get; set; }
        public string TipoDeProyecto { get; set; }
        public int FaseId { get; set; }
        public string Fases { get; set; }
        public string Fondos { get; set; }

        public decimal Cost { get; set; }
        public int FondoId { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }

    public class Region
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Municipio
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TipoDeProyecto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Fase
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Fondo
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }


}
