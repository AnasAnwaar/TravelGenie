import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ service: 'travelgenie-payload-api', status: 'ok' })
}
