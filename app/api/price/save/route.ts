import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRICE_FILE = path.join(DATA_DIR, 'sol-price.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { price, timestamp, source } = body

    // Validate input
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price data' },
        { status: 400 }
      )
    }

    // Ensure data directory exists
    await ensureDataDir()

    // Create price data object
    const priceData = {
      price,
      timestamp: timestamp || Date.now(),
      source: source || 'coingecko',
      savedAt: new Date().toISOString()
    }

    // Save to file
    await fs.writeFile(PRICE_FILE, JSON.stringify(priceData, null, 2))
    
    console.log('Price saved to file:', priceData)
    
    return NextResponse.json({ 
      success: true, 
      data: priceData 
    })
  } catch (error) {
    console.error('Failed to save price:', error)
    return NextResponse.json(
      { error: 'Failed to save price' },
      { status: 500 }
    )
  }
}
