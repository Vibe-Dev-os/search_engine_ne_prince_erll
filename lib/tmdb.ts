const TMDB_API_KEY = "dc64985d022cc22a3e2a5aefa5e75f1b"
const TMDB_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzY0OTg1ZDAyMmNjMjJhM2UyYTVhZWZhNWU3NWYxYiIsIm5iZiI6MTc1ODc4NTc2MC4wODksInN1YiI6IjY4ZDRmMGUwYWY0YTMzNzAwNTEzYTMyOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kNLOpSYZ2JSX0EQBlU0f-7h7lDGz9Ozi0j_xS8VzmFA"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { iso_639_1: string; name: string }[]
  status: string
  tagline: string
  homepage: string
  imdb_id: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface SearchResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") => {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Search movies by query
export const searchMovies = async (query: string, page = 1): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
    )

    if (!response.ok) {
      throw new Error("Failed to search movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching movies:", error)
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
  }
}

// Get movie details by ID
export const getMovieDetails = async (id: number): Promise<MovieDetails | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to get movie details")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting movie details:", error)
    return null
  }
}

// Get movie credits (cast and crew)
export const getMovieCredits = async (id: number): Promise<{ cast: Cast[]; crew: Crew[] }> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to get movie credits")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting movie credits:", error)
    return { cast: [], crew: [] }
  }
}

// Get popular movies
export const getPopularMovies = async (page = 1): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`)

    if (!response.ok) {
      throw new Error("Failed to get popular movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting popular movies:", error)
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
  }
}

// Get movie genres
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to get genres")
    }

    const data = await response.json()
    return data.genres
  } catch (error) {
    console.error("Error getting genres:", error)
    return []
  }
}

// Enhanced discover movies with advanced filters
export interface DiscoverFilters {
  genre?: number
  year?: number
  minRating?: number
  sortBy?: "popularity.desc" | "popularity.asc" | "vote_average.desc" | "vote_average.asc" | "release_date.desc" | "release_date.asc"
  language?: string
}

export const discoverMovies = async (filters: DiscoverFilters = {}, page = 1): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: page.toString(),
      include_adult: "false",
      sort_by: filters.sortBy || "popularity.desc",
    })

    if (filters.genre) params.append("with_genres", filters.genre.toString())
    if (filters.year) params.append("year", filters.year.toString())
    if (filters.minRating) params.append("vote_average.gte", filters.minRating.toString())
    if (filters.language) params.append("with_original_language", filters.language)

    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`)

    if (!response.ok) {
      throw new Error("Failed to discover movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error discovering movies:", error)
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
  }
}

// Backward compatibility function
export const discoverMoviesByGenreAndYear = async (genre?: number, year?: number, page = 1): Promise<SearchResponse> => {
  return discoverMovies({ genre, year }, page)
}
