export interface ChartData {
  name: string
  value: number
}

export interface CallAnalyticsData {
  callDuration: ChartData[]
  callSuccess: ChartData[]
  agentPerformance: ChartData[]
}

export interface UserChartCustomization {
  id?: string
  email: string
  chartType: string
  customData: ChartData[]
  createdAt?: string
  updatedAt?: string
}
