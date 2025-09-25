import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MovieDetails } from "@/components/movie-details"
import { getMovieDetails, getMovieCredits } from "@/lib/tmdb"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetails(Number.parseInt(id))

  if (!movie) {
    return {
      title: "Movie Not Found - CineSearch",
    }
  }

  return {
    title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) - CineSearch`,
    description: movie.overview || `Details about ${movie.title}`,
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieId = Number.parseInt(id)

  if (isNaN(movieId)) {
    notFound()
  }

  const [movie, credits] = await Promise.all([getMovieDetails(movieId), getMovieCredits(movieId)])

  if (!movie) {
    notFound()
  }

  return <MovieDetails movie={movie} credits={credits} />
}
