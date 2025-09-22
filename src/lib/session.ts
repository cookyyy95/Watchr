import { supabase, supabaseAdmin } from './supabase'
import { Session, Swipe, Match, User } from '@/types'

export class SessionManager {
  async createSession(userName: string): Promise<{ session: Session; user: User }> {
    const code = this.generateSessionCode()
    const userId = crypto.randomUUID()
    
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        code,
        user_a_id: userId,
        status: 'waiting'
      })
      .select()
      .single()

    if (sessionError) {
      throw new Error(`Failed to create session: ${sessionError.message}`)
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        name: userName,
        session_id: session.id,
        is_ready: false
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`)
    }

    return { session, user }
  }

  async joinSession(code: string, userName: string): Promise<{ session: Session; user: User }> {
    // Find session by code
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', code)
      .eq('status', 'waiting')
      .single()

    if (sessionError || !session) {
      throw new Error('Invalid session code or session not available')
    }

    const userId = crypto.randomUUID()
    
    // Update session with user B
    const { error: updateError } = await supabaseAdmin
      .from('sessions')
      .update({ user_b_id: userId })
      .eq('id', session.id)

    if (updateError) {
      throw new Error(`Failed to join session: ${updateError.message}`)
    }

    // Create user B
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        name: userName,
        session_id: session.id,
        is_ready: false
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`)
    }

    return { session: { ...session, user_b_id: userId }, user }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) return null
    return data
  }

  async updateSessionGenre(sessionId: string, genreId: number): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sessions')
      .update({ 
        genre_id: genreId,
        status: 'active'
      })
      .eq('id', sessionId)

    if (error) {
      throw new Error(`Failed to update session genre: ${error.message}`)
    }
  }

  async recordSwipe(sessionId: string, userId: string, movieId: number, action: 'like' | 'pass'): Promise<void> {
    const { error } = await supabaseAdmin
      .from('swipes')
      .insert({
        session_id: sessionId,
        user_id: userId,
        movie_id: movieId,
        action
      })

    if (error) {
      throw new Error(`Failed to record swipe: ${error.message}`)
    }
  }

  async checkForMatch(sessionId: string, movieId: number): Promise<Match | null> {
    // Check if both users liked the same movie
    const { data: swipes, error } = await supabase
      .from('swipes')
      .select('*')
      .eq('session_id', sessionId)
      .eq('movie_id', movieId)
      .eq('action', 'like')

    if (error || !swipes || swipes.length < 2) {
      return null
    }

    // Check if both users are different
    const userIds = swipes.map(swipe => swipe.user_id)
    const uniqueUserIds = [...new Set(userIds)]
    
    if (uniqueUserIds.length < 2) {
      return null
    }

    // Create match
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .insert({
        session_id: sessionId,
        movie_id: movieId
      })
      .select()
      .single()

    if (matchError) {
      throw new Error(`Failed to create match: ${matchError.message}`)
    }

    return match
  }

  async getSessionSwipes(sessionId: string, userId: string): Promise<Swipe[]> {
    const { data, error } = await supabase
      .from('swipes')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId)

    if (error) return []
    return data || []
  }

  async getSessionMatches(sessionId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  }

  private generateSessionCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

export const sessionManager = new SessionManager()
