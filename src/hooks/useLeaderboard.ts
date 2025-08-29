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
    try {
      setLoading(true)
      setError(null)

      // Get date filter based on period
      const dateFilter = getDateFilter(period)
      
      // Build the query
      let query = supabase
        .from('pet_records')
        .select(`
          id,
          pet_name,
          animal_type,
          emoji,
          birth_time,
          death_time,
          survival_days,
          token_usage!inner(
            input_tokens,
            output_tokens,
            total_tokens,
            cost_usd,
            usage_date
          )
        `)

      // Apply date filter if not all time
      if (dateFilter) {
        query = query.gte('token_usage.usage_date', dateFilter)
      }

      const { data: rawData, error: queryError } = await query

      if (queryError) {
        throw new Error(`Failed to fetch leaderboard data: ${queryError.message}`)
      }

      // Process and aggregate the data
      const processedData = processLeaderboardData(rawData || [], sortBy)
      
      // Apply limit and add ranks
      const limitedData = processedData.slice(0, limit)
      const rankedData = limitedData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      setData(rankedData)
      setTotalCount(processedData.length)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [period, sortBy, limit])

  const refetch = async () => {
    await fetchLeaderboard()
  }

  useEffect(() => {
    fetchLeaderboard()
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
const processLeaderboardData = (rawData: RawPetData[], sortBy: SortType): LeaderboardEntry[] => {
  // Create a map to aggregate data by pet
  const petMap = new Map<string, LeaderboardEntry>()

  rawData.forEach((record) => {
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

    const pet = petMap.get(petId)!
    
    // Aggregate token usage data
    if (record.token_usage && Array.isArray(record.token_usage)) {
      record.token_usage.forEach((usage: TokenUsageData) => {
        pet.total_tokens += usage.total_tokens || 0
        pet.total_cost += usage.cost_usd || 0
        pet.input_tokens += usage.input_tokens || 0
        pet.output_tokens += usage.output_tokens || 0
      })
    } else if (record.token_usage) {
      // Single token_usage record
      const usage = record.token_usage
      pet.total_tokens += usage.total_tokens || 0
      pet.total_cost += usage.cost_usd || 0
      pet.input_tokens += usage.input_tokens || 0
      pet.output_tokens += usage.output_tokens || 0
    }
  })

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