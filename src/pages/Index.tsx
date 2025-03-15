
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import LoadingState from "@/components/LoadingState";
import { fetchData, type Film } from "@/services/api";
import { Film as FilmIcon, Users, Globe, Bug, Ship, Truck } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const response = await fetchData<Film>("films");
        setFilms(response.results);
      } catch (error) {
        console.error("Failed to load films:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilms();
  }, []);

  const categories = [
    {
      title: "Films",
      description: "Explore all Star Wars films from the original trilogy to the latest releases.",
      path: "/category/films",
      icon: <FilmIcon size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Characters",
      description: "Meet the heroes, villains, and everyone in between from the Star Wars universe.",
      path: "/category/people",
      icon: <Users size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Planets",
      description: "Discover the diverse worlds that make up the Star Wars galaxy.",
      path: "/category/planets",
      icon: <Globe size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Species",
      description: "Learn about the various species that inhabit the Star Wars universe.",
      path: "/category/species",
      icon: <Bug size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Vehicles",
      description: "Explore the ground and air vehicles used for transport and combat.",
      path: "/category/vehicles",
      icon: <Truck size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Starships",
      description: "Examine the spacecraft used for interplanetary and interstellar travel.",
      path: "/category/starships",
      icon: <Ship size={24} />,
      backgroundImage: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <Layout>
      <Hero />
      
      <section id="categories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Explore
            </div>
            <h2 className="text-4xl font-bold mb-4">The Complete Encyclopedia</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a category to begin your journey through the Star Wars universe, from the films that started it all to the characters, planets, and technology.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                description={category.description}
                path={category.path}
                icon={category.icon}
                backgroundImage={category.backgroundImage}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="films" className="py-20 px-6 bg-gradient-to-b from-transparent to-space-blue/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Films
              </div>
              <h2 className="text-4xl font-bold mb-2">Star Wars Saga</h2>
              <p className="text-muted-foreground max-w-2xl">
                From A New Hope to The Rise of Skywalker, explore the epic stories that defined the galaxy far, far away.
              </p>
            </div>
            <a 
              href="/category/films" 
              className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              View all films
              <FilmIcon size={16} />
            </a>
          </motion.div>
          
          {isLoading ? (
            <LoadingState text="Loading films..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film, index) => {
                const id = film.url.split("/").filter(Boolean).pop();
                return (
                  <ItemCard
                    key={film.episode_id}
                    id={id || ""}
                    title={film.title}
                    subtitle={`Episode ${film.episode_id}`}
                    category="films"
                    details={[
                      { label: "Director", value: film.director },
                      { label: "Release", value: new Date(film.release_date).getFullYear() },
                    ]}
                    index={index}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
