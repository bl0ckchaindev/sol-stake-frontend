import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRICE_FILE = path.join(DATA_DIR, 'sol-price.json')

export async function GET() {
  try {
    // Check if file exists
    try {
      await fs.access(PRICE_FILE)
    } catch {
      return NextResponse.json(
        { error: 'No price data found' },
        { status: 404 }
      )
    }

    // Read file
    const data = await fs.readFile(PRICE_FILE, 'utf8')
    const priceData = JSON.parse(data)
    
    // Check if data is still valid (within 24 hours)
    if (Date.now() - priceData.timestamp > 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Price data expired' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(priceData)
  } catch (error) {
    console.error('Failed to load price:', error)
    return NextResponse.json(
      { error: 'Failed to load price' },
      { status: 500 }
    )
  }
}
