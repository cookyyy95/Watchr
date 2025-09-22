# Watchr 🎬

A Tinder-style web app that helps two people find movies to watch together. Built with Next.js 13+, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Session Management**: Create or join sessions with 6-digit codes
- **Genre Selection**: Choose from TMDb's extensive genre list
- **Swipe Interface**: Tinder-style swipe cards for movie discovery
- **Real-time Matching**: Get notified when both users like the same movie
- **Mobile-First Design**: Optimized for mobile devices
- **Modern UI**: Beautiful animations and responsive design

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Movie Data**: TMDb API
- **Animations**: Framer Motion
- **Swipe Cards**: react-tinder-card
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A TMDb API key ([Get one here](https://www.themoviedb.org/settings/api))
- A Supabase account ([Sign up here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd watchr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Get your project URL and API keys from the Supabase dashboard

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses the following main tables:

- **sessions**: Stores session information and codes
- **users**: Stores user information for each session
- **swipes**: Records user swipe actions
- **matches**: Stores when both users like the same movie

## API Routes

- `POST /api/sessions` - Create a new session
- `GET /api/sessions?code=XXXXXX` - Get session by code
- `POST /api/sessions/join` - Join an existing session
- `POST /api/swipes` - Record a swipe action

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add your environment variables in Vercel dashboard
   - Deploy!

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database schema
   - Update environment variables with production URLs

## Usage

1. **Create a Session**: One person creates a session and gets a 6-digit code
2. **Join Session**: The other person enters the code to join
3. **Select Genre**: Both users choose a movie genre
4. **Start Swiping**: Swipe right on movies you like, left to pass
5. **Find Matches**: When both users like the same movie, you get a match!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDb](https://www.themoviedb.org/) for the movie database API
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting
- [react-tinder-card](https://github.com/3DJakob/react-tinder-card) for the swipe functionality
