import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { userName } = await request.json()
    
    if (!userName || typeof userName !== 'string') {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      )
    }

    const { session, user } = await sessionManager.createSession(userName)
    
    return NextResponse.json({ session, user })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json(
        { error: 'Session code is required' },
        { status: 400 }
      )
    }

    const session = await sessionManager.getSession(code)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Failed to get session:', error)
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
}
