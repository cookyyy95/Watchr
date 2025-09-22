import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId, movieId, action } = await request.json()
    
    if (!sessionId || !userId || !movieId || !action) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!['like', 'pass'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "like" or "pass"' },
        { status: 400 }
      )
    }

    await sessionManager.recordSwipe(sessionId, userId, movieId, action as 'like' | 'pass')
    
    // Check for match if it's a like
    let match = null
    if (action === 'like') {
      match = await sessionManager.checkForMatch(sessionId, movieId)
    }
    
    return NextResponse.json({ success: true, match })
  } catch (error) {
    console.error('Failed to record swipe:', error)
    return NextResponse.json(
      { error: 'Failed to record swipe' },
      { status: 500 }
    )
  }
}
