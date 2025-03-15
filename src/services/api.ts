
import { toast } from "sonner";

const API_BASE_URL = "https://swapi.dev/api";

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Vehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Starship extends Vehicle {
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
}

export type ResourceType = "films" | "people" | "planets" | "species" | "vehicles" | "starships";

export async function fetchData<T>(endpoint: string, page = 1): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/${endpoint}/?page=${page}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    toast.error(`Failed to fetch ${endpoint}. Please try again.`);
    throw error;
  }
}

export async function fetchItem<T>(endpoint: string, id: string): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}/${id}/`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint} item:`, error);
    toast.error(`Failed to fetch details. Please try again.`);
    throw error;
  }
}

export async function fetchAllData<T>(endpoint: ResourceType): Promise<T[]> {
  let allResults: T[] = [];
  let nextPage: string | null = `${API_BASE_URL}/${endpoint}/`;
  
  while (nextPage) {
    try {
      const response = await fetch(nextPage);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: ApiResponse<T> = await response.json();
      allResults = [...allResults, ...data.results];
      nextPage = data.next;
    } catch (error) {
      console.error(`Error fetching all ${endpoint}:`, error);
      toast.error(`Failed to fetch all ${endpoint}. Please try again.`);
      throw error;
    }
  }
  
  return allResults;
}

export async function searchResource<T>(
  resource: ResourceType,
  query: string
): Promise<T[]> {
  const url = `${API_BASE_URL}/${resource}/?search=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error searching ${resource}:`, error);
    return [];
  }
}

export async function searchAcrossAll(query: string) {
  if (!query.trim()) return [];
  
  const resources: ResourceType[] = [
    "films",
    "people",
    "planets",
    "species",
    "vehicles",
    "starships",
  ];
  
  try {
    const searchPromises = resources.map(resource => searchResource(resource, query));
    const results = await Promise.all(searchPromises);
    
    return results
      .flatMap((items, index) => 
        items.map(item => {
          const resource = resources[index];
          // Extract ID from URL
          const id = (item as any).url.split("/").filter(Boolean).pop();
          
          return {
            id,
            name: (item as any).name,
            title: (item as any).title,
            category: resource,
            url: (item as any).url,
          };
        })
      )
      .sort((a, b) => {
        // Sort films first, then by name/title
        if (a.category === "films" && b.category !== "films") return -1;
        if (a.category !== "films" && b.category === "films") return 1;
        
        const aName = a.name || a.title || "";
        const bName = b.name || b.title || "";
        return aName.localeCompare(bName);
      });
  } catch (error) {
    console.error("Error searching across all resources:", error);
    return [];
  }
}

export function getIdFromUrl(url: string): string {
  return url.split("/").filter(Boolean).pop() || "";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function resolveUrl<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error resolving URL ${url}:`, error);
    throw error;
  }
}
