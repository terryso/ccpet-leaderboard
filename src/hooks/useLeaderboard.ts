import React, { useState, useEffect } from 'react'
import { supabase, type LeaderboardEntry } from '@/lib/supabase'

export type PeriodType = 'today' | '7days' | '30days' | 'alltime'
export type SortType = 'tokens' | 'cost' | 'survival'

interface UseLeaderboardOptions {
  period: PeriodType
  sortBy: SortType
  limit?: number
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[]
  loading: boolean
  error: string | null
  totalCount: number
  refetch: () => Promise<void>
}

export const useLeaderboard = ({
  period,
  sortBy,
  limit = 25
}: UseLeaderboardOptions): UseLeaderboardReturn => {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchLeaderboard = React.useCallback(async () => {
    // Create abort controller for this request
    const abortController = new AbortController()
    
    try {
      setLoading(true)
      setError(null)

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setData([])
        setTotalCount(0)
        return
      }

      // Store abort controller for cleanup
      const currentController = abortController

      // Add timeout with abort signal
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          currentController.abort()
          reject(new Error('Request timeout'))
        }, 15000) // Increased timeout to 15 seconds
        
        // Clear timeout if request completes
        currentController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId)
        })
      })

      // Build the query - always get all pets first
      const query = supabase
        .from('pet_records')
        .select(`
          id,
          pet_name,
          animal_type,
          emoji,
          birth_time,
          death_time,
          survival_days,
          token_usage(
            input_tokens,
            output_tokens,
            total_tokens,
            cost_usd,
            usage_date
          )
        `)
        .abortSignal(currentController.signal) // Add abort signal to query

      const queryPromise = query

      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ])
      
      // Check if request was aborted
      if (currentController.signal.aborted) {
        return
      }
      
      const { data: rawData, error: queryError } = result as { data: RawPetData[] | null; error: Error | null }

      if (queryError) {
        throw new Error(`Database error: ${queryError.message}`)
      }

      // Process and aggregate the data
      const processedData = processLeaderboardData(rawData || [], sortBy, period)
      
      // Apply limit and add ranks
      const limitedData = processedData.slice(0, limit)
      const rankedData = limitedData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      // Only update state if component is still mounted
      if (!currentController.signal.aborted) {
        setData(rankedData)
        setTotalCount(processedData.length)
      }
    } catch (err) {
      // Don't handle errors if request was aborted
      if (abortController.signal.aborted) {
        return
      }
      
      console.error('Error fetching leaderboard:', err)
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to load pet data'
      
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('aborted')) {
          errorMessage = 'Connection timed out. Please check your internet connection.'
        } else if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error. Please try again later.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      
      // Set empty data on error
      setData([])
      setTotalCount(0)
    } finally {
      // Only update loading state if not aborted
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }

    // Return cleanup function
    return () => {
      abortController.abort()
    }
  }, [period, sortBy, limit])

  const refetch = async () => {
    await fetchLeaderboard()
  }

  useEffect(() => {
    const cleanup = fetchLeaderboard()
    
    // Return cleanup function for useEffect
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn) => {
          if (typeof cleanupFn === 'function') {
            cleanupFn()
          }
        })
      }
    }
  }, [fetchLeaderboard])

  return {
    data,
    loading,
    error,
    totalCount,
    refetch
  }
}

// Helper function to get date filter based on period
const getDateFilter = (period: PeriodType): string | null => {
  const now = new Date()
  let filterDate: Date

  switch (period) {
    case 'today':
      filterDate = new Date(now)
      filterDate.setHours(0, 0, 0, 0)
      break
    case '7days':
      filterDate = new Date(now)
      filterDate.setDate(now.getDate() - 7)
      break
    case '30days':
      filterDate = new Date(now)
      filterDate.setDate(now.getDate() - 30)
      break
    case 'alltime':
      return null
    default:
      return null
  }

  return filterDate.toISOString().split('T')[0]
}

// Type for raw data from Supabase
interface RawPetData {
  id: string
  pet_name: string
  animal_type: string
  emoji: string | null
  birth_time: string
  death_time: string | null
  survival_days: number | null
  token_usage: TokenUsageData | TokenUsageData[]
}

interface TokenUsageData {
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd: number
  usage_date: string
}

// Helper function to process and aggregate leaderboard data
const processLeaderboardData = (rawData: RawPetData[], sortBy: SortType, period: PeriodType): LeaderboardEntry[] => {
  // Get date filter for client-side filtering
  const dateFilter = getDateFilter(period)
  
  // Create a map to aggregate data by pet
  const petMap = new Map<string, LeaderboardEntry>()

  for (const record of rawData) {
    const petId = record.id
    
    if (!petMap.has(petId)) {
      // Calculate survival days if not provided
      let survivalDays = record.survival_days || 0
      if (survivalDays === 0 && record.birth_time) {
        const birthDate = new Date(record.birth_time)
        const endDate = record.death_time ? new Date(record.death_time) : new Date()
        survivalDays = Math.floor((endDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
      }

      petMap.set(petId, {
        id: petId,
        pet_name: record.pet_name,
        animal_type: record.animal_type,
        emoji: record.emoji,
        birth_time: record.birth_time,
        death_time: record.death_time,
        survival_days: survivalDays,
        is_alive: !record.death_time,
        total_tokens: 0,
        total_cost: 0,
        input_tokens: 0,
        output_tokens: 0,
        rank: 0
      })
    }

    const pet = petMap.get(petId)
    if (!pet) continue
    
    // Aggregate token usage data with date filtering
    if (record.token_usage && Array.isArray(record.token_usage)) {
      for (const usage of record.token_usage) {
        // Apply date filter if specified
        if (dateFilter && usage.usage_date < dateFilter) {
          continue
        }
        pet.total_tokens += usage.total_tokens || 0
        pet.total_cost += usage.cost_usd || 0
        pet.input_tokens += usage.input_tokens || 0
        pet.output_tokens += usage.output_tokens || 0
      }
    } else if (record.token_usage) {
      // Single token_usage record
      const usage = record.token_usage
      // Apply date filter if specified
      if (!dateFilter || usage.usage_date >= dateFilter) {
        pet.total_tokens += usage.total_tokens || 0
        pet.total_cost += usage.cost_usd || 0
        pet.input_tokens += usage.input_tokens || 0
        pet.output_tokens += usage.output_tokens || 0
      }
    }
    // If no token_usage records, the pet will still be included with 0 values
  }

  // Convert to array and sort
  const petsArray = Array.from(petMap.values())
  
  return sortLeaderboardData(petsArray, sortBy)
}

// Helper function to sort leaderboard data
const sortLeaderboardData = (data: LeaderboardEntry[], sortBy: SortType): LeaderboardEntry[] => {
  const sortedData = [...data]
  
  switch (sortBy) {
    case 'tokens':
      sortedData.sort((a, b) => b.total_tokens - a.total_tokens)
      break
    case 'cost':
      sortedData.sort((a, b) => b.total_cost - a.total_cost)
      break
    case 'survival':
      sortedData.sort((a, b) => b.survival_days - a.survival_days)
      break
    default:
      sortedData.sort((a, b) => b.total_tokens - a.total_tokens)
  }
  
  return sortedData
}