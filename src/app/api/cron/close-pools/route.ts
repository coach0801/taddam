import { NextRequest, NextResponse } from 'next/server'
import { closePools } from '@/lib/pool-engine'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const results = await closePools()
    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('[CRON]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
