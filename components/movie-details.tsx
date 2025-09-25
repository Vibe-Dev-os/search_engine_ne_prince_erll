"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, Clock, DollarSign, Globe, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type MovieDetails as MovieDetailsType, type Cast, type Crew, getImageUrl } from "@/lib/tmdb"

interface MovieDetailsProps {
  movie: MovieDetailsType
  credits: { cast: Cast[]; crew: Crew[] }
}

export function MovieDetails({ movie, credits }: MovieDetailsProps) {
  const [imageError, setImageError] = useState(false)
  const [backdropError, setBackdropError] = useState(false)

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"

  const director = credits.crew.find((person) => person.job === "Director")
  const writers = credits.crew.filter((person) => person.job === "Writer" || person.job === "Screenplay")
  const producers = credits.crew.filter((person) => person.job === "Producer")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={
            backdropError
              ? "/placeholder.svg?height=1080&width=1920&query=movie+backdrop"
              : getImageUrl(movie.backdrop_path, "original")
          }
          alt={movie.title}
          fill
          className="object-cover"
          onError={() => setBackdropError(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <Image
                  src={
                    imageError
                      ? "/placeholder.svg?height=750&width=500&query=movie+poster"
                      : getImageUrl(movie.poster_path, "w500")
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </Card>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">{movie.title}</h1>
              {movie.tagline && <p className="text-xl text-muted-foreground italic mb-4">"{movie.tagline}"</p>}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-muted-foreground">({movie.vote_count.toLocaleString()} votes)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{releaseYear}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{runtime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg leading-relaxed text-pretty">{movie.overview}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {director && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Director</span>
                    </div>
                    <p className="text-muted-foreground">{director.name}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Status</span>
                  </div>
                  <p className="text-muted-foreground">{movie.status}</p>
                </CardContent>
              </Card>

              {movie.budget > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Budget</span>
                    </div>
                    <p className="text-muted-foreground">{formatCurrency(movie.budget)}</p>
                  </CardContent>
                </Card>
              )}

              {movie.revenue > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Revenue</span>
                    </div>
                    <p className="text-muted-foreground">{formatCurrency(movie.revenue)}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Cast and Crew Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="cast" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cast" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cast
              </TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="cast" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {credits.cast.slice(0, 20).map((person) => (
                  <Card key={person.id} className="overflow-hidden">
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={
                          person.profile_path
                            ? getImageUrl(person.profile_path, "w300")
                            : "/placeholder.svg?height=400&width=300&query=person+portrait"
                        }
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1">{person.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{person.character}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crew" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Director",
                  "Producer",
                  "Writer",
                  "Screenplay",
                  "Executive Producer",
                  "Cinematography",
                  "Music",
                  "Editor",
                ].map((job) => {
                  const people = credits.crew.filter((person) => person.job === job)
                  if (people.length === 0) return null

                  return (
                    <Card key={job}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{job}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {people.map((person) => (
                            <div key={person.id} className="flex items-center gap-3">
                              <div className="w-10 h-10 relative rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={
                                    person.profile_path
                                      ? getImageUrl(person.profile_path, "w200")
                                      : "/placeholder.svg?height=40&width=40&query=person+avatar"
                                  }
                                  alt={person.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">{person.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Production Companies</h4>
                      <div className="space-y-1">
                        {movie.production_companies.map((company) => (
                          <p key={company.id} className="text-sm text-muted-foreground">
                            {company.name}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Production Countries</h4>
                      <div className="flex flex-wrap gap-1">
                        {movie.production_countries.map((country) => (
                          <Badge key={country.iso_3166_1} variant="outline" className="text-xs">
                            {country.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {movie.spoken_languages.map((language) => (
                          <Badge key={language.iso_639_1} variant="outline" className="text-xs">
                            {language.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Original Title</h4>
                      <p className="text-sm text-muted-foreground">{movie.original_title}</p>
                    </div>

                    {movie.homepage && (
                      <div>
                        <h4 className="font-semibold mb-2">Official Website</h4>
                        <a
                          href={movie.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {movie.imdb_id && (
                      <div>
                        <h4 className="font-semibold mb-2">IMDb</h4>
                        <a
                          href={`https://www.imdb.com/title/${movie.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View on IMDb
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
