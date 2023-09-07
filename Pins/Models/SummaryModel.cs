namespace Pins.Models
{
    public class SummaryModel
    {
        public int MunicipiosCount { get; set; }
        public int ProyectosCount { get; set; }
        public decimal TotalAmount { get; set; }
        public List<Point> Points { get; set; }
    }
}
