import { supabase } from './supabase'
import type { UserChartCustomization } from '../types'

// Mock storage for when Supabase is not configured
const mockStorage: { [key: string]: UserChartCustomization } = {}

export async function saveCustomData(data: UserChartCustomization) {
  const email = data.email
  
  if (supabase) {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('chart_customizations')
        .select('*')
        .eq('email', email)
        .eq('chartType', data.chartType)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingData) {
        const { error: updateError } = await supabase
          .from('chart_customizations')
          .update({
            ...data,
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('chart_customizations')
          .insert([{
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }])

        if (insertError) throw insertError
      }
    } catch (error) {
      // Fallback to mock storage
      mockStorage[`${email}-${data.chartType}`] = data
    }
  } else {
    // Use mock storage when Supabase is not configured
    mockStorage[`${email}-${data.chartType}`] = data
  }
}

export async function getCustomData(email: string, chartType: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('chart_customizations')
        .select('*')
        .eq('email', email)
        .eq('chartType', chartType)
        .single()

      if (error && error.code === 'PGRST116') {
        return null
      }

      if (error) throw error
      return data as UserChartCustomization
    } catch (error) {
      // Fallback to mock storage
      return mockStorage[`${email}-${chartType}`] || null
    }
  } else {
    // Use mock storage when Supabase is not configured
    return mockStorage[`${email}-${chartType}`] || null
  }
}
