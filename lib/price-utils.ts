/**
 * Price utilities for converting SOL to USD and other currencies
 */

// React hook import
import { useState, useEffect } from 'react'

// Cache for price data
let priceCache: { price: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const FALLBACK_PRICE = 100 // Default fallback price

// File storage operations via localStorage (for static export)
const savePriceToFile = async (price: number, timestamp: number): Promise<boolean> => {
  // Skip API calls during build time
  if (typeof window === 'undefined') {
    return false
  }

  try {
    // Use localStorage for static export
    const priceData = {
      price,
      timestamp,
      source: 'coingecko',
      savedAt: new Date().toISOString()
    }
    
    localStorage.setItem('sol-price-cache', JSON.stringify(priceData))
    return true
  } catch (error) {
    console.warn('Failed to save price to localStorage:', error)
    return false
  }
}

// Load cached price from localStorage (for static export)
const loadCachedPrice = async (): Promise<{ price: number; timestamp: number } | null> => {
  // Skip API calls during build time
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const cached = localStorage.getItem('sol-price-cache')
    if (!cached) {
      return null
    }

    const data = JSON.parse(cached)
    
    // Check if data is still valid (within 24 hours)
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      return null
    }
    
    return { price: data.price, timestamp: data.timestamp }
  } catch (error) {
    console.warn('Failed to load cached price from localStorage:', error)
    return null
  }
}

// Initialize cache from file storage
const initializeCache = async () => {
  // Only initialize in browser environment
  if (typeof window !== 'undefined') {
    priceCache = await loadCachedPrice()
  }
}

// Initialize cache only in browser environment
if (typeof window !== 'undefined') {
  initializeCache()
}

/**
 * Get current SOL price in USD
 * Uses CoinGecko API with file storage persistence
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

    // Cache the price in memory and save to file
    const timestamp = Date.now()
    priceCache = { price, timestamp }
    await savePriceToFile(price, timestamp)

    console.log('SOL price updated and saved to file:', price)
    return price
  } catch (error) {
    console.error('Failed to fetch SOL price:', error)
    
    // Return cached price if available (from memory or file)
    if (priceCache) {
      console.warn('Using cached SOL price due to API error')
      return priceCache.price
    }
    
    // Try to load from file as last resort
    const cached = await loadCachedPrice()
    if (cached) {
      console.warn('Using file cached SOL price')
      priceCache = cached
      return cached.price
    }
    
    // Final fallback price
    console.warn('Using fallback SOL price')
    return FALLBACK_PRICE
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
 * Force refresh the SOL price (bypasses cache)
 */
export async function refreshSolPrice(): Promise<number> {
  // Clear cache to force fresh fetch
  priceCache = null
  
  // Fetch fresh data and save to file
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    )

    if (response.ok) {
      const data = await response.json()
      const price = data.solana?.usd

      if (typeof price === 'number' && price > 0) {
        const timestamp = Date.now()
        priceCache = { price, timestamp }
        await savePriceToFile(price, timestamp)
        console.log('SOL price refreshed and saved to file:', price)
        return price
      }
    }
  } catch (error) {
    console.warn('Failed to refresh price:', error)
  }
  
  return await getSolPrice()
}

/**
 * Get cached price without making API call
 */
export async function getCachedSolPrice(): Promise<number | null> {
  // First check memory cache
  if (priceCache && Date.now() - priceCache.timestamp < 24 * 60 * 60 * 1000) {
    return priceCache.price
  }
  
  // Then check file cache
  const cached = await loadCachedPrice()
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    priceCache = cached
    return cached.price
  }
  
  // Return fallback price if no valid cache
  return FALLBACK_PRICE
}

/**
 * Get price with loading state for React components
 * Includes automatic periodic updates
 */
export function useSolPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout | null = null

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

    // First, try to load cached price immediately
    const loadCachedPriceFirst = async () => {
      try {
        const cached = await getCachedSolPrice()
        if (cached && mounted) {
          setPrice(cached)
          setLoading(false)
        }
      } catch (err) {
        console.warn('Failed to load cached price:', err)
      }
    }

    // Load cached price first, then fetch fresh data
    loadCachedPriceFirst().then(() => {
      if (mounted) {
        fetchPrice()
      }
    })

    // Set up periodic updates every 5 minutes
    intervalId = setInterval(() => {
      if (mounted) {
        fetchPrice()
      }
    }, 5 * 60 * 1000)

    return () => {
      mounted = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  return { price, loading, error }
}

