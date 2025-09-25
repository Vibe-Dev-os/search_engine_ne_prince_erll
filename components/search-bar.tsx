"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Genre, DiscoverFilters } from "@/lib/tmdb"

interface SearchBarProps {
  onSearch: (query: string, filters?: DiscoverFilters) => void
  genres: Genre[]
  isLoading?: boolean
}

export function SearchBar({ onSearch, genres, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("any")
  const [selectedRating, setSelectedRating] = useState<string>("any")
  const [selectedSort, setSelectedSort] = useState<string>("popularity.desc")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("any")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const hasActiveFilters = selectedGenre !== "all" || selectedYear !== "any" || selectedRating !== "any" || selectedSort !== "popularity.desc" || selectedLanguage !== "any"

  // Function to trigger search with current filters
  const triggerSearch = () => {
    const filters: DiscoverFilters = {
      genre: selectedGenre !== "all" ? Number.parseInt(selectedGenre) : undefined,
      year: selectedYear !== "any" ? Number.parseInt(selectedYear) : undefined,
      minRating: selectedRating !== "any" ? Number.parseFloat(selectedRating) : undefined,
      sortBy: selectedSort as DiscoverFilters["sortBy"],
      language: selectedLanguage !== "any" ? selectedLanguage : undefined,
    }
    
    onSearch(query, filters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const filters: DiscoverFilters = {
      genre: selectedGenre !== "all" ? Number.parseInt(selectedGenre) : undefined,
      year: selectedYear !== "any" ? Number.parseInt(selectedYear) : undefined,
      minRating: selectedRating !== "any" ? Number.parseFloat(selectedRating) : undefined,
      sortBy: selectedSort as DiscoverFilters["sortBy"],
      language: selectedLanguage !== "any" ? selectedLanguage : undefined,
    }
    
    onSearch(query, filters)
  }

  const clearAllFilters = () => {
    setSelectedGenre("all")
    setSelectedYear("any")
    setSelectedRating("any")
    setSelectedSort("popularity.desc")
    setSelectedLanguage("any")
    onSearch(query)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
  
  const ratings = [
    { value: "any", label: "Any Rating" },
    { value: "7", label: "7+ Stars" },
    { value: "6", label: "6+ Stars" },
    { value: "5", label: "5+ Stars" },
    { value: "4", label: "4+ Stars" },
  ]

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
  ]

  const languages = [
    { value: "any", label: "Any Language" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg bg-card border-border"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Basic Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>

        <Select value={selectedGenre} onValueChange={(value) => {
          setSelectedGenre(value)
          // Trigger search after state update
          setTimeout(() => triggerSearch(), 0)
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={(value) => {
          setSelectedYear(value)
          setTimeout(() => triggerSearch(), 0)
        }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Year</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSort} onValueChange={(value) => {
          setSelectedSort(value)
          setTimeout(() => triggerSearch(), 0)
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Advanced Filters:</span>
            </div>

            <Select value={selectedRating} onValueChange={(value) => {
              setSelectedRating(value)
              setTimeout(() => triggerSearch(), 0)
            }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((rating) => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={(value) => {
              setSelectedLanguage(value)
              setTimeout(() => triggerSearch(), 0)
            }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
