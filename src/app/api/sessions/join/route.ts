import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { code, userName } = await request.json()
    
    if (!code || !userName) {
      return NextResponse.json(
        { error: 'Session code and user name are required' },
        { status: 400 }
      )
    }

    const { session, user } = await sessionManager.joinSession(code, userName)
    
    return NextResponse.json({ session, user })
  } catch (error) {
    console.error('Failed to join session:', error)
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    )
  }
}
