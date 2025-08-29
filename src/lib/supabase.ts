import { createClient } from '@supabase/supabase-js'

// Supabase configuration - these should be environment variables in production
const supabaseUrl = 'https://rzsupavqzxhyrgcexrpx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6c3VwYXZxenhoeXJnY2V4cnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NzI4MTMsImV4cCI6MjA2MzA0ODgxM30.6S5s7ruZA6x3JRc6d9Oq8USOBxoDlJCXOXTOaJKimPA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions based on your Supabase schema
export interface PetRecord {
  id: string
  pet_name: string
  animal_type: string
  emoji: string | null
  birth_time: string
  death_time: string | null
  survival_days: number | null
  created_at: string
  updated_at: string
}

export interface TokenUsage {
  id: string
  pet_id: string | null
  usage_date: string
  input_tokens: number
  output_tokens: number
  cache_tokens: number
  total_tokens: number
  cost_usd: number
  model_name: string | null
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  pet_name: string
  animal_type: string
  emoji: string | null
  birth_time: string
  death_time: string | null
  survival_days: number
  is_alive: boolean
  total_tokens: number
  total_cost: number
  rank: number
  input_tokens: number
  output_tokens: number
}

// Helper function to get animal emoji (fallback when emoji field is null)
export const getAnimalEmoji = (animalType: string, emoji?: string | null): string => {
  // Use stored emoji if available
  if (emoji) {
    return emoji
  }
  
  // Fallback to type-based emoji mapping
  const emojiMap: { [key: string]: string } = {
    cat: '🐱',
    dog: '🐶', 
    rabbit: '🐰',
    hamster: '🐹',
    bird: '🐦',
    fish: '🐠',
    turtle: '🐢',
    fox: '🦊',
    panda: '🐼',
    default: '🐾'
  }
  
  return emojiMap[animalType.toLowerCase()] || emojiMap.default
}