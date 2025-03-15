
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ItemCard from "@/components/ItemCard";
import LoadingState from "@/components/LoadingState";
import { fetchData, ApiResponse, ResourceType } from "@/services/api";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type CategoryData = {
  [key: string]: {
    title: string;
    singularTitle: string;
    description: string;
    itemTransform: (item: any) => {
      id: string;
      title: string;
      subtitle?: string;
      details: Array<{ label: string; value: string | number }>;
    };
  };
};

const categoryData: CategoryData = {
  films: {
    title: "Films",
    singularTitle: "Film",
    description: "All Star Wars films from the original trilogy to the latest releases.",
    itemTransform: (film) => ({
      id: film.url.split("/").filter(Boolean).pop() || "",
      title: film.title,
      subtitle: `Episode ${film.episode_id}`,
      details: [
        { label: "Director", value: film.director },
        { label: "Release", value: new Date(film.release_date).getFullYear() },
      ],
    }),
  },
  people: {
    title: "Characters",
    singularTitle: "Character",
    description: "Heroes, villains, and everyone in between from the Star Wars universe.",
    itemTransform: (person) => ({
      id: person.url.split("/").filter(Boolean).pop() || "",
      title: person.name,
      subtitle: person.gender !== "n/a" ? person.gender : undefined,
      details: [
        { label: "Birth Year", value: person.birth_year !== "unknown" ? person.birth_year : "Unknown" },
        { label: "Species", value: "Loading..." }, // This would be resolved later
      ],
    }),
  },
  planets: {
    title: "Planets",
    singularTitle: "Planet",
    description: "Diverse worlds that make up the Star Wars galaxy.",
    itemTransform: (planet) => ({
      id: planet.url.split("/").filter(Boolean).pop() || "",
      title: planet.name,
      subtitle: `Population: ${planet.population !== "unknown" ? Number(planet.population).toLocaleString() : "Unknown"}`,
      details: [
        { label: "Climate", value: planet.climate },
        { label: "Terrain", value: planet?.terrain?.split(", ")[0] },
      ],
    }),
  },
  species: {
    title: "Species",
    singularTitle: "Species",
    description: "Various species that inhabit the Star Wars universe.",
    itemTransform: (species) => ({
      id: species.url.split("/").filter(Boolean).pop() || "",
      title: species.name,
      subtitle: species.classification,
      details: [
        { label: "Language", value: species.language },
        { label: "Lifespan", value: species.average_lifespan !== "unknown" ? `${species.average_lifespan} years` : "Unknown" },
      ],
    }),
  },
  vehicles: {
    title: "Vehicles",
    singularTitle: "Vehicle",
    description: "Ground and air vehicles used for transport and combat.",
    itemTransform: (vehicle) => ({
      id: vehicle.url.split("/").filter(Boolean).pop() || "",
      title: vehicle.name,
      subtitle: vehicle.manufacturer,
      details: [
        { label: "Class", value: vehicle.vehicle_class },
        { label: "Length", value: `${vehicle.length} m` },
      ],
    }),
  },
  starships: {
    title: "Starships",
    singularTitle: "Starship",
    description: "Spacecraft used for interplanetary and interstellar travel.",
    itemTransform: (starship) => ({
      id: starship.url.split("/").filter(Boolean).pop() || "",
      title: starship.name,
      subtitle: starship.model,
      details: [
        { label: "Class", value: starship.starship_class },
        { label: "Hyperdrive", value: starship.hyperdrive_rating },
      ],
    }),
  },
};

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category || !Object.keys(categoryData).includes(category)) {
      navigate("/not-found");
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchData(category as ResourceType, currentPage);
        setItems(response.results);
        
        // Calculate total pages
        const totalItems = response.count;
        const pages = Math.ceil(totalItems / 10); // SWAPI returns 10 items per page
        setTotalPages(pages);
      } catch (err) {
        console.error(`Error loading ${category}:`, err);
        setError(`Failed to load ${category}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [category, currentPage, navigate]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (!category || !categoryData[category]) return null;

  const { title, description } = categoryData[category];

  return (
    <Layout className="pt-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Category
          </div>
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {description}
          </p>
        </motion.div>

        {isLoading ? (
          <LoadingState text={`Loading ${title.toLowerCase()}...`} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-red-400 mb-4">{error}</p>
            <button
              onClick={() => handlePageChange(currentPage)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {items.map((item, index) => {
                const { id, title, subtitle, details } = categoryData[category].itemTransform(item);
                return (
                  <ItemCard
                    key={`${id}-${index}`}
                    id={id}
                    title={title}
                    subtitle={subtitle}
                    category={category}
                    details={details}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-card/50 border border-white/10 hover:bg-primary/10 hover:border-primary/30 disabled:opacity-50 disabled:hover:bg-card/50 disabled:hover:border-white/10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "bg-card/50 border border-white/10 hover:bg-primary/10 hover:border-primary/30"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-card/50 border border-white/10 hover:bg-primary/10 hover:border-primary/30 disabled:opacity-50 disabled:hover:bg-card/50 disabled:hover:border-white/10 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Category;
