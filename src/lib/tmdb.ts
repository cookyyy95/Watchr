import { Movie, Genre } from '@/types'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL!

export class TMDBClient {
  private async fetchFromTMDB(endpoint: string) {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchFromTMDB('/genre/movie/list')
    return data.genres
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<{
    movies: Movie[]
    totalPages: number
    totalResults: number
  }> {
    const data = await this.fetchFromTMDB(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`)
    
    return {
      movies: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results
    }
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.fetchFromTMDB(`/movie/${movieId}`)
  }

  async searchMovies(query: string, page: number = 1): Promise<{
    movies: Movie[]
    totalPages: number
    totalResults: number
  }> {
    const data = await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
    
    return {
      movies: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results
    }
  }
}

export const tmdbClient = new TMDBClient()
