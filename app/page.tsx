"use client"

import { useState, useEffect } from "react"
import { Film } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { MovieGrid } from "@/components/movie-grid"
import { Pagination } from "@/components/pagination"
import {
  type Movie,
  type SearchResponse,
  type Genre,
  type DiscoverFilters,
  searchMovies,
  getPopularMovies,
  getGenres,
  discoverMovies,
} from "@/lib/tmdb"

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilters, setCurrentFilters] = useState<DiscoverFilters>({})

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      const genreList = await getGenres()
      setGenres(genreList)
    }
    loadGenres()
  }, [])

  // Load popular movies on initial load
  useEffect(() => {
    const loadPopularMovies = async () => {
      setIsLoading(true)
      const response = await getPopularMovies(1)
      setMovies(response.results)
      setTotalPages(Math.min(response.total_pages, 500)) // TMDB limits to 500 pages
      setTotalResults(response.total_results)
      setIsLoading(false)
    }
    loadPopularMovies()
  }, [])

  const handleSearch = async (query: string, filters?: DiscoverFilters) => {
    setIsLoading(true)
    setCurrentPage(1)
    setSearchQuery(query)
    setCurrentFilters(filters || {})

    let response: SearchResponse

    if (query.trim()) {
      response = await searchMovies(query, 1)
    } else if (filters && Object.keys(filters).length > 0) {
      response = await discoverMovies(filters, 1)
    } else {
      response = await getPopularMovies(1)
    }

    setMovies(response.results)
    setTotalPages(Math.min(response.total_pages, 500))
    setTotalResults(response.total_results)
    setIsLoading(false)
  }

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)

    let response: SearchResponse

    if (searchQuery.trim()) {
      response = await searchMovies(searchQuery, page)
    } else if (Object.keys(currentFilters).length > 0) {
      response = await discoverMovies(currentFilters, page)
    } else {
      response = await getPopularMovies(page)
    }

    setMovies(response.results)
    setIsLoading(false)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getResultsText = () => {
    if (totalResults === 0) return ""

    const start = (currentPage - 1) * 20 + 1
    const end = Math.min(currentPage * 20, totalResults)

    return `Showing ${start}-${end} of ${totalResults.toLocaleString()} results`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold brand-gradient">DSA GROUP 3</h1>
                <p className="text-sm text-muted-foreground">Movie Discovery Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 hero-gradient rounded-2xl p-12 border border-border/50">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            Discover Cinema
            <span className="text-primary"> Like Never Before</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Experience the ultimate movie discovery platform. Search through thousands of films with our advanced search
            engine powered by cutting-edge technology.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm font-medium text-primary">Made with</span>
            <span className="text-sm font-bold text-primary">MOHAMAD ERL LIMOSNERO</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} genres={genres} isLoading={isLoading} />
        </div>

        {/* Results Info */}
        {totalResults > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">{getResultsText()}</p>
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid movies={movies} isLoading={isLoading} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-1.5 bg-primary rounded-md">
                <Film className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold brand-gradient">DSA GROUP 3</span>
            </div>
            <p className="text-sm text-muted-foreground">Crafting exceptional movie discovery experiences</p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Movie data provided by The Movie Database (TMDB)</p>
              <p className="text-xs text-muted-foreground mt-1">
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
