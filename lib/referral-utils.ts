/**
 * Referral Code Utilities
 * Pure encoding/decoding system for public keys to referral codes
 * No database or localStorage required - fully deterministic
 */

import { PublicKey } from "@solana/web3.js"

export interface ReferralCodeValidation {
  isValid: boolean
  error?: string
  address?: string
}

/**
 * Base58 alphabet for encoding (Solana standard)
 */
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/**
 * Encode a number to base58
 */
function encodeBase58(num: number): string {
  if (num === 0) return '1'
  
  let encoded = ''
  while (num > 0) {
    encoded = BASE58_ALPHABET[num % 58] + encoded
    num = Math.floor(num / 58)
  }
  return encoded
}

/**
 * Decode base58 to number
 */
function decodeBase58(encoded: string): number {
  let decoded = 0
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i]
    const index = BASE58_ALPHABET.indexOf(char)
    if (index === -1) throw new Error('Invalid base58 character')
    decoded = decoded * 58 + index
  }
  return decoded
}

/**
 * Encode bytes directly to base58 with compression
 */
function encodeBytesToBase58(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''
  
  // Apply a simple XOR transformation to make the encoding different from raw base58
  // This ensures we get a different result than the original address
  const transformedBytes = new Uint8Array(bytes.length)
  const xorKey = 0x42 // Simple XOR key
  
  for (let i = 0; i < bytes.length; i++) {
    transformedBytes[i] = bytes[i] ^ xorKey
  }
  
  // Count leading zeros in transformed bytes
  let leadingZeros = 0
  for (let i = 0; i < transformedBytes.length && transformedBytes[i] === 0; i++) {
    leadingZeros++
  }
  
  // Convert transformed bytes to a big integer (represented as array of digits in base 58)
  let digits: number[] = []
  for (let i = 0; i < transformedBytes.length; i++) {
    let carry = transformedBytes[i]
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] * 256
      digits[j] = carry % 58
      carry = Math.floor(carry / 58)
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }
  
  // Convert digits to base58 string
  let result = ''
  for (let i = 0; i < leadingZeros; i++) {
    result += '1' // '1' represents 0 in base58
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    result += BASE58_ALPHABET[digits[i]]
  }
  
  return result
}

/**
 * Decode base58 directly to bytes with XOR transformation reversal
 */
function decodeBase58ToBytes(encoded: string): Uint8Array | null {
  if (encoded.length === 0) return new Uint8Array(0)
  
  // Count leading ones (which represent zeros)
  let leadingZeros = 0
  for (let i = 0; i < encoded.length && encoded[i] === '1'; i++) {
    leadingZeros++
  }
  
  // Convert base58 string to digits
  const digits: number[] = []
  for (let i = leadingZeros; i < encoded.length; i++) {
    const char = encoded[i]
    const index = BASE58_ALPHABET.indexOf(char)
    if (index === -1) return null
    digits.push(index)
  }
  
  // Convert digits to bytes
  const result: number[] = []
  for (let i = 0; i < digits.length; i++) {
    let carry = digits[i]
    for (let j = 0; j < result.length; j++) {
      carry += result[j] * 58
      result[j] = carry % 256
      carry = Math.floor(carry / 256)
    }
    while (carry > 0) {
      result.push(carry % 256)
      carry = Math.floor(carry / 256)
    }
  }
  
  // Reverse and add leading zeros
  const transformedBytes = new Uint8Array(leadingZeros + result.length)
  for (let i = 0; i < leadingZeros; i++) {
    transformedBytes[i] = 0
  }
  for (let i = 0; i < result.length; i++) {
    transformedBytes[leadingZeros + i] = result[result.length - 1 - i]
  }
  
  // Reverse the XOR transformation to get original bytes
  const originalBytes = new Uint8Array(transformedBytes.length)
  const xorKey = 0x42 // Same XOR key as encoding
  
  for (let i = 0; i < transformedBytes.length; i++) {
    originalBytes[i] = transformedBytes[i] ^ xorKey
  }
  
  return originalBytes
}

/**
 * Generate a deterministic referral code from a public key
 * Uses base58 encoding directly on the byte array
 */
export function generateReferralCode(publicKey: PublicKey): string {
  if (!publicKey) return ""
  
  try {
    // Convert public key to bytes
    const bytes = publicKey.toBytes()
    
    // Encode bytes directly to base58
    const encoded = encodeBytesToBase58(bytes)
    
    // Add a prefix to make it clear it's a referral code
    return `REF${encoded}`
  } catch (error) {
    console.error('Error generating referral code:', error)
    return ""
  }
}

/**
 * Decode a referral code back to the original public key
 * This completely reverses the encoding process
 */
export function decodeReferralCode(referralCode: string): PublicKey | null {
  if (!validateReferralCodeFormat(referralCode)) {
    return null
  }
  
  try {
    // Remove the REF prefix
    if (!referralCode.startsWith('REF')) {
      return null
    }
    
    const encodedPart = referralCode.slice(3) // Remove 'REF' prefix
    
    // Decode from base58 directly to bytes
    const bytes = decodeBase58ToBytes(encodedPart)
    
    if (!bytes || bytes.length !== 32) {
      return null
    }
    
    // Create PublicKey from bytes
    return new PublicKey(bytes)
  } catch (error) {
    console.error('Error decoding referral code:', error)
    return null
  }
}

/**
 * Verify if a public key matches a referral code
 * This is the most reliable way to check if a code belongs to an address
 */
export function verifyReferralCode(referralCode: string, publicKey: PublicKey): boolean {
  if (!validateReferralCodeFormat(referralCode) || !publicKey) {
    return false
  }
  
  // Generate the code from the public key and compare
  const generatedCode = generateReferralCode(publicKey)
  return generatedCode === referralCode.toUpperCase()
}

/**
 * Get the address prefix from a referral code
 */
export function getAddressPrefixFromCode(referralCode: string): string | null {
  if (!validateReferralCodeFormat(referralCode)) {
    return null
  }
  
  return referralCode.slice(0, 2)
}

/**
 * Validate a referral code format
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  
  // Must start with REF prefix
  if (!code.startsWith('REF')) return false
  
  // Must be at least 4 characters (REF + at least 1 character)
  if (code.length < 4) return false
  
  // Must contain only base58 characters
  const base58Regex = /^REF[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/
  return base58Regex.test(code)
}

/**
 * Extract the encoded part from referral code (without REF prefix)
 */
export function extractEncodedPart(referralCode: string): string | null {
  if (!validateReferralCodeFormat(referralCode)) return null
  
  // Remove REF prefix
  return referralCode.slice(3)
}

/**
 * Get the original public key from a referral code
 */
export function getPublicKeyFromCode(referralCode: string): PublicKey | null {
  return decodeReferralCode(referralCode)
}

/**
 * Check if a referral code belongs to a specific public key
 * This does an exact match by decoding and comparing
 */
export function belongsToAddress(referralCode: string, publicKey: PublicKey): boolean {
  if (!validateReferralCodeFormat(referralCode)) return false
  
  const decodedPublicKey = decodeReferralCode(referralCode)
  if (!decodedPublicKey) return false
  
  return decodedPublicKey.equals(publicKey)
}

/**
 * Find the exact address that matches a referral code
 * This decodes the referral code directly to get the public key
 */
export function findExactAddressForCode(referralCode: string): string | null {
  if (!validateReferralCodeFormat(referralCode)) return null
  
  const publicKey = decodeReferralCode(referralCode)
  return publicKey ? publicKey.toString() : null
}

/**
 * Test the encode/decode cycle to ensure it works correctly
 */
export function testEncodeDecode(publicKey: PublicKey): boolean {
  try {
    const code = generateReferralCode(publicKey)
    const decoded = decodeReferralCode(code)
    
    return decoded ? decoded.equals(publicKey) : false
  } catch (error) {
    console.error('Encode/decode test failed:', error)
    return false
  }
}

/**
 * Generate multiple referral codes for testing
 */
export function generateTestReferralCodes(count: number = 5): Array<{
  address: string
  code: string
  decodedAddress: string
  isValid: boolean
}> {
  const results: Array<{ 
    address: string; 
    code: string; 
    decodedAddress: string; 
    isValid: boolean 
  }> = []
  
  for (let i = 0; i < count; i++) {
    // Generate a random public key for testing
    const randomBytes = new Uint8Array(32)
    crypto.getRandomValues(randomBytes)
    
    try {
      const publicKey = new PublicKey(randomBytes)
      const code = generateReferralCode(publicKey)
      const decoded = decodeReferralCode(code)
      const decodedAddress = decoded ? decoded.toString() : 'Failed to decode'
      const isValid = decoded ? decoded.equals(publicKey) : false
      
      results.push({
        address: publicKey.toString(),
        code: code,
        decodedAddress: decodedAddress,
        isValid: isValid
      })
    } catch (error) {
      // Skip invalid keys
      console.warn('Skipped invalid public key:', error)
    }
  }
  
  return results
}

/**
 * Migration utility to convert old referral codes to new format
 */
export function migrateOldReferralCode(oldCode: string, publicKey: PublicKey): string {
  // If it's already in the new format (starts with REF), return as is
  if (oldCode.startsWith('REF')) {
    return oldCode
  }
  
  // If it's the old format (first 8 chars of address), generate new one
  const expectedOldCode = publicKey.toString().slice(0, 8).toUpperCase()
  
  if (oldCode === expectedOldCode) {
    return generateReferralCode(publicKey)
  }
  
  // For any other format, generate a new code
  return generateReferralCode(publicKey)
}

/**
 * Create a referral code registry for quick lookups
 * This can be used to maintain a list of known addresses and their codes
 */
export function createReferralCodeRegistry(addresses: string[]): Map<string, string> {
  const registry = new Map<string, string>()
  
  for (const address of addresses) {
    try {
      const pubKey = new PublicKey(address)
      const code = generateReferralCode(pubKey)
      registry.set(code, address)
    } catch {
      // Skip invalid addresses
      continue
    }
  }
  
  return registry
}

/**
 * Get referral code statistics for analytics
 */
export function getReferralCodeStats(codes: string[]): {
  totalCodes: number
  validCodes: number
  uniqueCodes: number
  commonPrefixes: Record<string, number>
} {
  const validCodes = codes.filter(validateReferralCodeFormat)
  const uniqueCodes = new Set(validCodes).size
  
  // Count common prefixes (first 2 characters)
  const prefixCounts: Record<string, number> = {}
  validCodes.forEach(code => {
    const prefix = code.slice(0, 2)
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1
  })
  
  return {
    totalCodes: codes.length,
    validCodes: validCodes.length,
    uniqueCodes,
    commonPrefixes: prefixCounts
  }
}
