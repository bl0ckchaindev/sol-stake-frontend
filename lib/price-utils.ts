/**
 * Price utilities for converting SOL to USD and other currencies
 */

// Cache for price data
let priceCache: { price: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get current SOL price in USD
 * Uses CoinGecko API with caching
 */
export async function getSolPrice(): Promise<number> {
  // Return cached price if still valid
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.price
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const price = data.solana?.usd

    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid price data received')
    }

    // Cache the price
    priceCache = {
      price,
      timestamp: Date.now()
    }

    return price
  } catch (error) {
    console.error('Failed to fetch SOL price:', error)
    
    // Return cached price if available, otherwise fallback
    if (priceCache) {
      console.warn('Using cached SOL price due to API error')
      return priceCache.price
    }
    
    // Fallback price (you might want to update this periodically)
    console.warn('Using fallback SOL price')
    return 100 // Fallback price
  }
}

/**
 * Convert SOL amount to USD
 */
export async function solToUsd(solAmount: number): Promise<number> {
  const price = await getSolPrice()
  return solAmount * price
}

/**
 * Convert USD amount to SOL
 */
export async function usdToSol(usdAmount: number): Promise<number> {
  const price = await getSolPrice()
  return usdAmount / price
}

/**
 * Format USD amount with proper currency formatting
 */
export function formatUsd(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

/**
 * Format SOL amount with proper formatting
 */
export function formatSol(amount: number, decimals: number = 4): string {
  return `${amount.toFixed(decimals)} SOL`
}

/**
 * Get price with loading state for React components
 */
export function useSolPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchPrice = async () => {
      try {
        setLoading(true)
        setError(null)
        const solPrice = await getSolPrice()
        
        if (mounted) {
          setPrice(solPrice)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch price')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPrice()

    return () => {
      mounted = false
    }
  }, [])

  return { price, loading, error }
}

// React hook import
import { useState, useEffect } from 'react'
