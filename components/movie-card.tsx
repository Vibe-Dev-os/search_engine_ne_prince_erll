"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Movie, getImageUrl } from "@/lib/tmdb"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={
              imageError ? "/placeholder.svg?height=750&width=500&query=movie+poster" : getImageUrl(movie.poster_path)
            }
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-medium text-white">{rating}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{releaseYear}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {movie.overview || "No description available."}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {movie.original_language.toUpperCase()}
            </Badge>
            {movie.vote_count > 0 && (
              <span className="text-xs text-muted-foreground">{movie.vote_count.toLocaleString()} votes</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
