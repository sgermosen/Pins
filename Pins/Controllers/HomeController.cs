using Microsoft.AspNetCore.Mvc;
using Pins.Models;
using System.Diagnostics;

namespace Pins.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetFilteredPoints([FromBody] FilterModel model)
        {
            List<Point> points = GetPoints();

            var filteredPoints = points.AsEnumerable();

            if (model.RegionId != null && model.RegionId.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.RegionId != null && model.RegionId.Contains(p.RegionId));
            }

            if (model.MunicipioId != null && model.MunicipioId.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.MunicipioId != null && model.MunicipioId.Contains(p.MunicipioId));
            }

            if (!string.IsNullOrWhiteSpace(model.Descripcion))
            {
                filteredPoints = filteredPoints.Where(p => p.Descripcion.ToUpper().Contains(model.Descripcion.ToUpper()));
            }

            if (model.TipoDeProyectoId != null && model.TipoDeProyectoId.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.TipoDeProyectoId != null && model.TipoDeProyectoId.Contains(p.TipoDeProyectoId));
            }

            if (model.FaseId != null && model.FaseId.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.FaseId != null && model.FaseId.Contains(p.FaseId));
            }

            if (model.FondoId != null && model.FondoId.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.FondoId != null && model.FondoId.Contains(p.FondoId));
            }

            if (model.Id != null && model.Id.Length > 0)
            {
                filteredPoints = filteredPoints.Where(p => p.Id != null && model.Id.Contains(p.Id));
            }

            var summary = new SummaryModel
            {
                MunicipiosCount = filteredPoints.Select(p => p.MunicipioId).Distinct().Count(),
                ProyectosCount = filteredPoints.Count(),
                TotalAmount = filteredPoints.Sum(p => p.Cost),
                Points = filteredPoints.ToList()
            };

            return Json(summary);
        }

        [HttpPost]
        public JsonResult GetInitialPoints([FromBody] object data)
        {
            List<Point> points = GetPoints();
            var filteredPoints = points.AsEnumerable();
            //el count de proyectos estan mal y revisar el de los montos 
            var summary = new SummaryModel
            {
                MunicipiosCount = filteredPoints.Select(p => p.MunicipioId).Distinct().Count(),
                ProyectosCount = filteredPoints.Count(),
                TotalAmount = filteredPoints.Sum(p => p.Cost),
                Points = filteredPoints.ToList()
            };

            return Json(summary);
        }


        private static List<Point> GetPoints()
        {
            List<Municipio> municipios = new List<Municipio>
            {
                //Aguadilla
                new Municipio { Id = 1, Name = "Aguadilla" },
                new Municipio { Id = 2, Name = "Moca" },
                new Municipio { Id = 3, Name = "Lares" },

                //Arecibo
                new Municipio { Id = 4, Name = "Arecibo" },
                new Municipio { Id = 5, Name = "Ciales" },
                new Municipio { Id = 6, Name = "Naranjito" },

                //San Juan
                new Municipio { Id = 7, Name = "Bayamón" },
                new Municipio { Id = 8, Name = "San Juan" },
                new Municipio { Id = 9, Name = "Trujillo Alto" },
                new Municipio { Id = 10, Name = "Carolina" },

                //Humacao
                new Municipio { Id = 11, Name = "Vieques" },
                new Municipio { Id = 12, Name = "Fajardo" },
                new Municipio { Id = 13, Name = "Juncos" },
                new Municipio { Id = 14, Name = "Caguas" },

                //Guayama
                new Municipio { Id = 15, Name = "Cayey" },
                new Municipio { Id = 16, Name = "Cidra" },
                new Municipio { Id = 17, Name = "Salinas" },

                 //Ponce
                new Municipio { Id = 18, Name = "Adjuntas" },
                new Municipio { Id = 19, Name = "Ponce" },
                new Municipio { Id = 20, Name = "Villalba" },

                 //Mayaguez
                new Municipio { Id = 21, Name = "San Germán" },
                new Municipio { Id = 22, Name = "Yauco" },
                new Municipio { Id = 23, Name = "Lajas" },

            };

            List<Region> regions = new List<Region>
            {
                new Region { Id = 1, Name = "Aguadilla" },
                new Region { Id = 2, Name = "Arecibo" },
                new Region { Id = 3, Name = "San Juan" },
                new Region { Id = 4, Name = "Humacao" },
                new Region { Id = 5, Name = "Guayama" },
                new Region { Id = 6, Name = "Ponce" },
                new Region { Id = 7, Name = "Mayagüez" },
            };

            List<TipoDeProyecto> tiposDeProyecto = new List<TipoDeProyecto>
            {
                new TipoDeProyecto { Id = 1, Name = "Alcantarillado Sanitario" },
                new TipoDeProyecto { Id = 2, Name = "Generadores" },
                new TipoDeProyecto { Id = 3, Name = "Acueductos" },
            };

            List<Fase> fases = new List<Fase>
            {
                new Fase { Id = 1, Name = "Pre-calificación" },
                new Fase { Id = 2, Name = "Planificación" },
                new Fase { Id = 3, Name = "Diseño" },
                new Fase { Id = 4, Name = "Subasta" },
                new Fase { Id = 5, Name = "Construcción" },
                new Fase { Id = 6, Name = "Finalizado" }
            };

            List<Fondo> fondos = new List<Fondo>
            {
                new Fondo { Id = 1, Name = "CWSRF" },
                new Fondo { Id = 2, Name = "AAA" },
                new Fondo { Id = 3, Name = "FEMA" },
                new Fondo { Id = 4, Name = "CDBGDR" },
                new Fondo { Id = 5, Name = "CWSRF,AAA" },
                new Fondo { Id = 6, Name = "FEMA,CDBGDR,AAA" }
            };

            var points = new List<Point>();

            points.Add(new Point
            {
                Id = 1,
                VideoUrl = "https://www.youtube.com/watch?v=UhFxxZJyNhg",
                RegionId = 1,  
                Region = regions.FirstOrDefault(r => r.Id == 1).Name,
                MunicipioId = 1,  //Aguadilla
                Municipio = municipios.FirstOrDefault(m => m.Id == 1).Name,
                Descripcion = "Troncal Sanitaria Aguas Buenas - Caguas Fase III (LB-J 2)",
                TipoDeProyectoId = 1, //Alcantarillado Sanitario
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 3,
                Fases = fases.FirstOrDefault(f => f.Id == 3).Name,
                FondoId = 2, //CWSRF,AAA
                Fondos = fondos.FirstOrDefault(f => f.Id == 2).Name,
                Latitude = 18.485918084036207,
                Cost = 1000000,
                Longitude = -67.11712788293018
            });
            
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=Xu_74D-ehWY",
                Id = 2,
                RegionId = 1, //Este
                Region = regions.FirstOrDefault(r => r.Id == 1).Name,
                MunicipioId = 2, //Moca
                Municipio = municipios.FirstOrDefault(m => m.Id == 2).Name,
                Descripcion = "EBAS San Antonio - Emergency Generators - Phase 2 East",
                TipoDeProyectoId = 2, //Generadores
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 2).Name,
                FaseId = 4,
                Fases = fases.FirstOrDefault(f => f.Id == 4).Name,
                FondoId = 1, //AAA
                Fondos = fondos.FirstOrDefault(f => f.Id == 1).Name,
                Latitude = 18.397655671505742,
                Cost = 1000000,
                Longitude = -67.10236500461706
            });
            points.Add(new Point
            {
                Id = 3,
                VideoUrl = "https://www.youtube.com/watch?v=Xu_74D-ehWY",

                RegionId = 1, //Este
                Region = regions.FirstOrDefault(r => r.Id == 1).Name,
                MunicipioId = 3, //Lares
                Municipio = municipios.FirstOrDefault(m => m.Id == 3).Name,
                Descripcion = "EBAS Vistas de Jagueyes - Emergency Generators - Phase 2 East",
                TipoDeProyectoId = 2, //Generadores
                Cost = 5000000,

                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 2).Name,
                FaseId = 2,
                Fases = fases.FirstOrDefault(f => f.Id == 2).Name,
                FondoId = 1, //AAA
                Fondos = fondos.FirstOrDefault(f => f.Id == 1).Name,
                Latitude = 18.302899536039114,
                Longitude = -66.88583873445843
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=5gvwFf7UfEo",
                Id = 4,
                RegionId = 2,
                Region = regions.FirstOrDefault(r => r.Id == 2).Name,
                MunicipioId = 4, //Arecib
                Cost = 7000000,
                Municipio = municipios.FirstOrDefault(m => m.Id == 4).Name,
                Descripcion = "Rehabilitación de la PF Barrancas y la Toma (FAAST) (PL-8 y PL-77)",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 2,
                Fases = fases.FirstOrDefault(f => f.Id == 2).Name,
                FondoId = 6,
                Fondos = fondos.FirstOrDefault(f => f.Id == 6).Name,
                Latitude = 18.42552912999697,
                Longitude = -66.75166768098187
                 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=ajC1IXTxkWc",
                Id = 5,
                RegionId = 2,
                Region = regions.FirstOrDefault(r => r.Id == 2).Name,
                MunicipioId = 5, //Ciales
                Cost = 6000000,
                Municipio = municipios.FirstOrDefault(m => m.Id == 5).Name,
                Descripcion = "Replacement of Sanitary Sewer Force Main along PR-173",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 3,
                Fases = fases.FirstOrDefault(f => f.Id == 3).Name,
                FondoId = 1,
                Fondos = fondos.FirstOrDefault(f => f.Id == 1).Name,
                Latitude = 18.333117550694357,
                Longitude = -66.49902984784222 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=pzxa8dlN3XE",
                Id = 6,
                RegionId = 2,
                Region = regions.FirstOrDefault(r => r.Id == 2).Name,
                MunicipioId = 6,//Naranjito
                Municipio = municipios.FirstOrDefault(m => m.Id == 6).Name,
                Descripcion = "Construction of a New Wastewater Treatment Plant",
                TipoDeProyectoId = 1,
                Cost = 2000000,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 4,
                Fases = fases.FirstOrDefault(f => f.Id == 4).Name,
                FondoId = 2,
                Fondos = fondos.FirstOrDefault(f => f.Id == 2).Name,
                Latitude = 18.293201195164563,
                Longitude = -66.25151472569425 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=oHXaG3LkubI",
                Id = 7,
                RegionId = 3,
                Region = regions.FirstOrDefault(r => r.Id == 3).Name,
                MunicipioId = 7, //Bayamón
                Cost = 1000000,
                Municipio = municipios.FirstOrDefault(m => m.Id == 7).Name,
                Descripcion = "Reconstruction of Carolina Sewer Interceptor",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 5,
                Fases = fases.FirstOrDefault(f => f.Id == 5).Name,
                FondoId = 3,
                Fondos = fondos.FirstOrDefault(f => f.Id == 3).Name,
                Latitude = 18.37001315599355,
                Longitude = -66.16424977548311
               
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=85aSBj_AIWQ",
                Id = 8,
                RegionId = 3,
                Region = regions.FirstOrDefault(r => r.Id == 3).Name,
                Cost = 1000000,
                MunicipioId = 8, //San Juan
                Municipio = municipios.FirstOrDefault(m => m.Id == 8).Name,
                Descripcion = "Barceloneta Wastewater Treatment Plant Rehabilitation",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 1,
                Fases = fases.FirstOrDefault(f => f.Id == 1).Name,
                FondoId = 4,
                Fondos = fondos.FirstOrDefault(f => f.Id == 4).Name,
                Latitude = 18.42421279142213,
                Longitude = -66.05080534449861 
            });
            points.Add(new Point
            {
                Id = 9,
                VideoUrl = "https://www.youtube.com/watch?v=noD1BYXjC0Q",
                RegionId = 3,
                Region = regions.FirstOrDefault(r => r.Id == 3).Name,
                MunicipioId = 9, //Trujillo Alto
                Cost = 1000000,
                Municipio = municipios.FirstOrDefault(m => m.Id == 9).Name,
                Descripcion = "Sanitary Sewer System Improvements",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 2,
                Fases = fases.FirstOrDefault(f => f.Id == 2).Name,
                FondoId = 5,
                Fondos = fondos.FirstOrDefault(f => f.Id == 5).Name,
                Latitude = 18.34742494555403,
                Longitude = -66.02700581352285 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=JA0bJeKaUj8",
                Id = 10,
                RegionId = 3,
                Cost = 1000000,
                Region = regions.FirstOrDefault(r => r.Id == 3).Name,
                MunicipioId = 10, //Carolina
                Municipio = municipios.FirstOrDefault(m => m.Id == 10).Name,
                Descripcion = "Water System Improvements",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 3,
                Fases = fases.FirstOrDefault(f => f.Id == 3).Name,
                FondoId = 6,
                Fondos = fondos.FirstOrDefault(f => f.Id == 6).Name,
                Latitude = 18.391092818122598,
                Longitude = -65.95798717369311 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=iltSDN4YIIA",
                Id = 11,
                RegionId = 4,
                Cost = 1000000,
                Region = regions.FirstOrDefault(r => r.Id == 4).Name,
                MunicipioId = 11, //"Vieques" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 11).Name,
                Descripcion = "Stormwater System Rehabilitation",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(m => m.Id == 1).Name,
                FaseId = 4,
                Fases = fases.FirstOrDefault(f => f.Id == 4).Name,
                FondoId = 2,
                Fondos = fondos.FirstOrDefault(f => f.Id == 2).Name,
                Latitude = 18.11836500309911,
                Longitude = -65.46137028416274 
            });
            points.Add(new Point
            {
                Id = 12,
                VideoUrl = "https://www.youtube.com/watch?v=DgnsH61a7II",
                RegionId = 4,
                Region = regions.FirstOrDefault(r => r.Id == 4).Name,
                MunicipioId = 12, //"Fajardo" 
                Cost = 1000000,
                Municipio = municipios.FirstOrDefault(m => m.Id == 12).Name,
                Descripcion = "Water Supply System Expansion",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 5,
                Fases = fases.FirstOrDefault(f => f.Id == 5).Name,
                FondoId = 3,
                Fondos = fondos.FirstOrDefault(f => f.Id == 3).Name,
                Latitude = 18.339894884336466,
                Longitude = -65.6446266751861 
            });
            points.Add(new Point
            {
                Id = 13,
                VideoUrl = "https://www.youtube.com/watch?v=58jrLwCV4yY",
                Cost = 5000000,
                RegionId = 4,
                Region = regions.FirstOrDefault(r => r.Id == 4).Name,
                MunicipioId = 13,//"Juncos" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 13).Name,
                Descripcion = "Drinking Water Treatment Facility Improvement",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,

                FaseId = 6,
                Fases = fases.FirstOrDefault(f => f.Id == 6).Name,
                FondoId = 4,
                Fondos = fondos.FirstOrDefault(f => f.Id == 4).Name,
                Latitude = 18.23217919335802,
                Longitude = -65.90007497511596 
            });
            points.Add(new Point
            {
                Id = 14,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 1000000,
                RegionId = 4,
                Region = regions.FirstOrDefault(r => r.Id == 4).Name,
                MunicipioId = 14,//"Caguas" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 14).Name,
                Descripcion = "Sewage System Upgrades",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,

                FaseId = 1,
                Fases = fases.FirstOrDefault(f => f.Id == 1).Name,
                FondoId = 5,
                Fondos = fondos.FirstOrDefault(f => f.Id == 5).Name,
                Latitude = 18.22991870674377,
                Longitude = -66.01827931351875 
            });
            points.Add(new Point
            {
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Id = 15,
                Cost = 1000000,
                RegionId = 5,
                Region = regions.FirstOrDefault(r => r.Id == 5).Name,
                MunicipioId = 15, //"Cayey" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 15).Name,
                Descripcion = "New Sewage Collection and Treatment System",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,

                FaseId = 2,
                Fases = fases.FirstOrDefault(f => f.Id == 2).Name,
                FondoId = 6,
                Fondos = fondos.FirstOrDefault(f => f.Id == 6).Name,
                Latitude = 18.12366739802422,
                Longitude = -66.15201024492046 
            });
            points.Add(new Point
            {
                Id = 16,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 1000000,
                RegionId = 5,
                Region = regions.FirstOrDefault(r => r.Id == 5).Name,
                MunicipioId = 16,//"Cidra" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 16).Name,
                Descripcion = "Water Distribution System Rehabilitation",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 3,
                Fases = fases.FirstOrDefault(f => f.Id == 3).Name,
                FondoId = 1,
                Fondos = fondos.FirstOrDefault(f => f.Id == 1).Name,
                Latitude = 18.17965129994204,
                Longitude = -66.17861739749658 
            });
            points.Add(new Point
            {
                Id = 17,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                RegionId = 5,
                Cost = 2000000,
                Region = regions.FirstOrDefault(r => r.Id == 5).Name,
                MunicipioId = 17,//"Salinas" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 17).Name,
                Descripcion = "Upgrade of Water Supply Infrastructure",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 4,
                Fases = fases.FirstOrDefault(f => f.Id == 4).Name,
                FondoId = 2,
                Fondos = fondos.FirstOrDefault(f => f.Id == 2).Name,
                Latitude = 17.97639859806487,
                Longitude = -66.26984192421618 
            });
            points.Add(new Point
            {
                Id = 18,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 18000000,
                RegionId = 6,
                Region = regions.FirstOrDefault(r => r.Id == 6).Name,
                MunicipioId = 18,//"Adjuntas" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 18).Name,
                Descripcion = "Stormwater Drainage System Improvement",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 5,
                Fases = fases.FirstOrDefault(f => f.Id == 5).Name,
                FondoId = 3,
                Fondos = fondos.FirstOrDefault(f => f.Id == 3).Name,
                Latitude = 18.17164376789639,
                Longitude = -66.72914259244776 
            });

            points.Add(new Point
            {
                Id = 19,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                RegionId = 6,
                Cost = 2000000,
                Region = regions.FirstOrDefault(r => r.Id == 6).Name,
                MunicipioId = 19,//"Ponce" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 19).Name,
                Descripcion = "Upgrade of Water Supply Infrastructure",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 4,
                Fases = fases.FirstOrDefault(f => f.Id == 4).Name,
                FondoId = 2,
                Fondos = fondos.FirstOrDefault(f => f.Id == 2).Name,
                Latitude = 18.03594476945269,
                Longitude = -66.6407968748534 
            });
            points.Add(new Point
            {
                Id = 20,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 18000000,
                RegionId = 6,
                Region = regions.FirstOrDefault(r => r.Id == 6).Name,
                MunicipioId = 20,//"Villalba" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 20).Name,
                Descripcion = "Stormwater Drainage System Improvement",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,
                FaseId = 5,
                Fases = fases.FirstOrDefault(f => f.Id == 5).Name,
                FondoId = 3,
                Fondos = fondos.FirstOrDefault(f => f.Id == 3).Name,
                Latitude = 18.101843312118014,
                Longitude = -66.51735272101136 
            });

            points.Add(new Point
            {
                Id = 21,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 1000000,
                RegionId = 7,
                Region = regions.FirstOrDefault(r => r.Id == 7).Name,
                MunicipioId = 21,//"San Germán"
                Municipio = municipios.FirstOrDefault(m => m.Id == 21).Name,
                Descripcion = "Water Distribution System Rehabilitation",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,
                FaseId = 3,
                Fases = fases.FirstOrDefault(f => f.Id == 3).Name,
                FondoId = 1,
                Fondos = fondos.FirstOrDefault(f => f.Id == 1).Name,
                Latitude = 18.090087932929542,
                Longitude = -67.04913735741977 
            });

            points.Add(new Point
            {
                Id = 22,
                VideoUrl = "https://www.youtube.com/watch?v=58jrLwCV4yY",
                Cost = 5000000,
                RegionId = 7,
                Region = regions.FirstOrDefault(r => r.Id == 7).Name,
                MunicipioId = 22,//"Yauco"  
                Municipio = municipios.FirstOrDefault(m => m.Id == 22).Name,
                Descripcion = "Drinking Water Treatment Facility Improvement",
                TipoDeProyectoId = 3,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 3).Name,

                FaseId = 6,
                Fases = fases.FirstOrDefault(f => f.Id == 6).Name,
                FondoId = 4,
                Fondos = fondos.FirstOrDefault(f => f.Id == 4).Name,
                Latitude = 18.05274209476273,
                Longitude = -66.85926623821483 
            });
            points.Add(new Point
            {
                Id = 23,
                VideoUrl = "https://www.youtube.com/watch?v=TOWjOBubUjw",
                Cost = 1000000,
                RegionId = 7,
                Region = regions.FirstOrDefault(r => r.Id == 7).Name,
                MunicipioId = 23,//"Lajas" 
                Municipio = municipios.FirstOrDefault(m => m.Id == 23).Name,
                Descripcion = "Sewage System Upgrades",
                TipoDeProyectoId = 1,
                TipoDeProyecto = tiposDeProyecto.FirstOrDefault(t => t.Id == 1).Name,

                FaseId = 1,
                Fases = fases.FirstOrDefault(f => f.Id == 1).Name,
                FondoId = 5,
                Fondos = fondos.FirstOrDefault(f => f.Id == 5).Name,
                Latitude = 18.02023092323143,
                Longitude = -67.05859454015436
            }); 
             
            return points;
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
