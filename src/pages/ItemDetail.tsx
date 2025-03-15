
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import LoadingState from "@/components/LoadingState";
import ItemCard from "@/components/ItemCard";
import {
  fetchItem,
  resolveUrl,
  getIdFromUrl,
  formatDate,
  Film,
  Person,
  Planet,
  Species,
  Vehicle,
  Starship,
  ResourceType,
} from "@/services/api";
import { ChevronLeft, ExternalLink } from "lucide-react";

type ItemType = Film | Person | Planet | Species | Vehicle | Starship;

interface DetailField {
  label: string;
  value: string | React.ReactNode;
  isUrl?: boolean;
}

const ItemDetail = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemType | null>(null);
  const [details, setDetails] = useState<DetailField[]>([]);
  const [relatedItems, setRelatedItems] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category || !id || !["films", "people", "planets", "species", "vehicles", "starships"].includes(category)) {
      navigate("/not-found");
      return;
    }

    const loadItem = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchItem<ItemType>(category as ResourceType, id);
        setItem(response);
        processItemDetails(response, category);
      } catch (err) {
        console.error(`Error loading ${category} details:`, err);
        setError(`Failed to load details. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [category, id, navigate]);

  const processItemDetails = async (item: ItemType, category: string) => {
    let detailFields: DetailField[] = [];
    const relatedUrls: { [key: string]: string[] } = {};

    switch (category) {
      case "films":
        const film = item as Film;
        detailFields = [
          { label: "Episode", value: `Episode ${film.episode_id}` },
          { label: "Director", value: film.director },
          { label: "Producer", value: film.producer },
          { label: "Release Date", value: formatDate(film.release_date) },
        ];
        relatedUrls.characters = film.characters;
        relatedUrls.planets = film.planets;
        relatedUrls.species = film.species;
        relatedUrls.vehicles = film.vehicles;
        relatedUrls.starships = film.starships;
        break;

      case "people":
        const person = item as Person;
        detailFields = [
          { label: "Height", value: `${person.height} cm` },
          { label: "Mass", value: `${person.mass} kg` },
          { label: "Hair Color", value: person.hair_color },
          { label: "Skin Color", value: person.skin_color },
          { label: "Eye Color", value: person.eye_color },
          { label: "Birth Year", value: person.birth_year },
          { label: "Gender", value: person.gender },
          { 
            label: "Homeworld", 
            value: "Loading...",
            isUrl: true
          },
        ];
        relatedUrls.films = person.films;
        relatedUrls.species = person.species;
        relatedUrls.vehicles = person.vehicles;
        relatedUrls.starships = person.starships;
        
        // Resolve homeworld
        try {
          const homeworld = await resolveUrl<Planet>(person.homeworld);
          detailFields = detailFields.map(field => 
            field.label === "Homeworld" 
              ? { 
                  label: "Homeworld", 
                  value: (
                    <Link 
                      to={`/category/planets/${getIdFromUrl(person.homeworld)}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {homeworld.name}
                      <ExternalLink size={12} />
                    </Link>
                  )
                }
              : field
          );
        } catch (error) {
          console.error("Failed to load homeworld:", error);
        }
        break;

      case "planets":
        const planet = item as Planet;
        detailFields = [
          { label: "Rotation Period", value: `${planet.rotation_period} hours` },
          { label: "Orbital Period", value: `${planet.orbital_period} days` },
          { label: "Diameter", value: `${planet.diameter} km` },
          { label: "Climate", value: planet.climate },
          { label: "Gravity", value: planet.gravity },
          { label: "Terrain", value: planet.terrain },
          { label: "Surface Water", value: `${planet.surface_water}%` },
          { label: "Population", value: planet.population !== "unknown" ? Number(planet.population).toLocaleString() : "Unknown" },
        ];
        relatedUrls.residents = planet.residents;
        relatedUrls.films = planet.films;
        break;

      case "species":
        const species = item as Species;
        detailFields = [
          { label: "Classification", value: species.classification },
          { label: "Designation", value: species.designation },
          { label: "Average Height", value: `${species.average_height} cm` },
          { label: "Skin Colors", value: species.skin_colors },
          { label: "Hair Colors", value: species.hair_colors },
          { label: "Eye Colors", value: species.eye_colors },
          { label: "Average Lifespan", value: species.average_lifespan !== "unknown" ? `${species.average_lifespan} years` : "Unknown" },
          { label: "Language", value: species.language },
        ];
        
        if (species.homeworld) {
          try {
            const homeworld = await resolveUrl<Planet>(species.homeworld);
            detailFields.push({ 
              label: "Homeworld", 
              value: (
                <Link 
                  to={`/category/planets/${getIdFromUrl(species.homeworld)}`}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {homeworld.name}
                  <ExternalLink size={12} />
                </Link>
              )
            });
          } catch (error) {
            console.error("Failed to load homeworld:", error);
            detailFields.push({ label: "Homeworld", value: "Unknown" });
          }
        } else {
          detailFields.push({ label: "Homeworld", value: "Unknown/None" });
        }
        
        relatedUrls.people = species.people;
        relatedUrls.films = species.films;
        break;

      case "vehicles":
        const vehicle = item as Vehicle;
        detailFields = [
          { label: "Model", value: vehicle.model },
          { label: "Manufacturer", value: vehicle.manufacturer },
          { label: "Cost", value: vehicle.cost_in_credits !== "unknown" ? `${Number(vehicle.cost_in_credits).toLocaleString()} credits` : "Unknown" },
          { label: "Length", value: `${vehicle.length} m` },
          { label: "Max Speed", value: `${vehicle.max_atmosphering_speed} km/h` },
          { label: "Crew", value: vehicle.crew },
          { label: "Passengers", value: vehicle.passengers },
          { label: "Cargo Capacity", value: vehicle.cargo_capacity !== "unknown" ? `${Number(vehicle.cargo_capacity).toLocaleString()} kg` : "Unknown" },
          { label: "Consumables", value: vehicle.consumables },
          { label: "Vehicle Class", value: vehicle.vehicle_class },
        ];
        relatedUrls.pilots = vehicle.pilots;
        relatedUrls.films = vehicle.films;
        break;

      case "starships":
        const starship = item as Starship;
        detailFields = [
          { label: "Model", value: starship.model },
          { label: "Manufacturer", value: starship.manufacturer },
          { label: "Cost", value: starship.cost_in_credits !== "unknown" ? `${Number(starship.cost_in_credits).toLocaleString()} credits` : "Unknown" },
          { label: "Length", value: `${starship.length} m` },
          { label: "Max Speed", value: `${starship.max_atmosphering_speed} km/h` },
          { label: "Crew", value: starship.crew },
          { label: "Passengers", value: starship.passengers },
          { label: "Cargo Capacity", value: starship.cargo_capacity !== "unknown" ? `${Number(starship.cargo_capacity).toLocaleString()} kg` : "Unknown" },
          { label: "Consumables", value: starship.consumables },
          { label: "Hyperdrive Rating", value: starship.hyperdrive_rating },
          { label: "MGLT", value: starship.MGLT },
          { label: "Starship Class", value: starship.starship_class },
        ];
        relatedUrls.pilots = starship.pilots;
        relatedUrls.films = starship.films;
        break;
    }

    setDetails(detailFields);

    // Load related items (limit to 5 per category)
    const loadRelatedItems = async () => {
      setIsLoadingRelated(true);
      const related: { [key: string]: any[] } = {};

      for (const [key, urls] of Object.entries(relatedUrls)) {
        if (urls.length > 0) {
          const limitedUrls = urls.slice(0, 6);
          try {
            const items = await Promise.all(limitedUrls.map(url => resolveUrl(url)));
            related[key] = items;
          } catch (error) {
            console.error(`Failed to load related ${key}:`, error);
          }
        }
      }

      setRelatedItems(related);
      setIsLoadingRelated(false);
    };

    loadRelatedItems();
  };

  // Get title based on item type and category
  const getItemTitle = () => {
    if (!item) return "";

    switch (category) {
      case "films":
        return (item as Film).title;
      default:
        return (item as any).name || "Unknown";
    }
  };

  // Get related item cards
  const getRelatedCards = (items: any[], relatedCategory: string) => {
    // Map category name from API to route path
    const categoryMap: { [key: string]: string } = {
      characters: "people",
      residents: "people",
      pilots: "people",
      people: "people",
      planets: "planets",
      species: "species",
      vehicles: "vehicles",
      starships: "starships",
      films: "films",
    };

    const routeCategory = categoryMap[relatedCategory] || relatedCategory;

    return items.map((relatedItem, index) => {
      const relatedId = getIdFromUrl(relatedItem.url);
      let title = "";
      let subtitle = "";
      let details = [];

      if (routeCategory === "films") {
        title = relatedItem.title;
        subtitle = `Episode ${relatedItem.episode_id}`;
        details = [
          { label: "Director", value: relatedItem.director },
          { label: "Release", value: new Date(relatedItem.release_date).getFullYear() },
        ];
      } else if (routeCategory === "people") {
        title = relatedItem.name;
        subtitle = relatedItem.gender !== "n/a" ? relatedItem.gender : undefined;
        details = [
          { label: "Birth Year", value: relatedItem.birth_year !== "unknown" ? relatedItem.birth_year : "Unknown" },
        ];
      } else if (routeCategory === "planets") {
        title = relatedItem.name;
        subtitle = `Population: ${relatedItem.population !== "unknown" ? Number(relatedItem.population).toLocaleString() : "Unknown"}`;
        details = [
          { label: "Climate", value: relatedItem.climate },
        ];
      } else if (routeCategory === "species") {
        title = relatedItem.name;
        subtitle = relatedItem.classification;
        details = [
          { label: "Language", value: relatedItem.language },
        ];
      } else if (routeCategory === "vehicles") {
        title = relatedItem.name;
        subtitle = relatedItem.manufacturer;
        details = [
          { label: "Class", value: relatedItem.vehicle_class },
        ];
      } else if (routeCategory === "starships") {
        title = relatedItem.name;
        subtitle = relatedItem.model;
        details = [
          { label: "Class", value: relatedItem.starship_class },
        ];
      }

      return (
        <ItemCard
          key={`${routeCategory}-${relatedId}-${index}`}
          id={relatedId}
          title={title}
          subtitle={subtitle}
          category={routeCategory}
          details={details}
          index={index}
          className="h-full"
        />
      );
    });
  };

  // Format category names for display
  const formatCategoryName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      characters: "Characters",
      residents: "Residents",
      pilots: "Pilots",
      people: "People",
      planets: "Planets",
      species: "Species",
      vehicles: "Vehicles",
      starships: "Starships",
      films: "Films",
    };

    return categoryMap[category] || category;
  };

  return (
    <Layout className="pt-24">
      <div className="max-w-7xl mx-auto px-6">
        {isLoading ? (
          <LoadingState text="Loading details..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-red-400 mb-4">{error}</p>
            <Link
              to={`/category/${category}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              <ChevronLeft size={16} />
              Back to {category}
            </Link>
          </div>
        ) : (
          <>
            {/* Back button */}
            <div className="mb-6">
              <Link
                to={`/category/${category}`}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
                Back to {formatCategoryName(category)}
              </Link>
            </div>

            {/* Title section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 capitalize">
                {category === "people" ? "Character" : category.slice(0, -1)}
              </div>
              <h1 className="text-5xl font-bold mb-4">{getItemTitle()}</h1>
              
              {category === "films" && (
                <p className="text-xl text-muted-foreground max-w-3xl mt-6 leading-relaxed">
                  {(item as Film).opening_crawl}
                </p>
              )}
            </motion.div>

            {/* Details grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {details.map((detail, index) => (
                      <div key={index} className="border-b border-white/10 pb-3">
                        <div className="text-sm text-muted-foreground mb-1">{detail.label}</div>
                        <div className="font-medium">
                          {detail.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <h2 className="text-2xl font-semibold mb-6">Information</h2>
                  <div className="space-y-4">
                    <div className="pb-3">
                      <div className="text-sm text-muted-foreground mb-1">Created</div>
                      <div className="font-medium">{item ? formatDate(item.created) : ""}</div>
                    </div>
                    <div className="pb-3">
                      <div className="text-sm text-muted-foreground mb-1">Last Edited</div>
                      <div className="font-medium">{item ? formatDate(item.edited) : ""}</div>
                    </div>
                    <div className="pb-3">
                      <div className="text-sm text-muted-foreground mb-1">API URL</div>
                      <div className="font-medium text-sm font-mono break-all text-primary/80">
                        {item?.url}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Related items sections */}
            {Object.keys(relatedItems).length > 0 && (
              <div className="space-y-16">
                {Object.entries(relatedItems).map(([relatedCategory, items], sectionIndex) => (
                  items.length > 0 && (
                    <motion.div
                      key={relatedCategory}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + (sectionIndex * 0.1) }}
                    >
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            Related
                          </div>
                          <h2 className="text-3xl font-bold mb-2">{formatCategoryName(relatedCategory)}</h2>
                          <p className="text-muted-foreground max-w-2xl">
                            {getItemTitle()} is associated with these {formatCategoryName(relatedCategory).toLowerCase()}.
                          </p>
                        </div>
                        
                        {items.length > 5 && (
                          <Link 
                            to={`/category/${relatedCategory === "characters" || relatedCategory === "residents" || relatedCategory === "pilots" ? "people" : relatedCategory}`} 
                            className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                          >
                            View all
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getRelatedCards(items, relatedCategory)}
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            )}
            
            {isLoadingRelated && (
              <div className="py-12">
                <LoadingState text="Loading related items..." />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ItemDetail;
