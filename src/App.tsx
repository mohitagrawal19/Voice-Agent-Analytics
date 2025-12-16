import { useState, useEffect } from 'react'
import { AnalyticsChart } from './components/AnalyticsChart'
import { EmailModal, EditChartModal } from './components/Modals'
import { getCustomData, saveCustomData } from './lib/storage'
import type { ChartData, UserChartCustomization } from './types'
import './index.css'

// Dummy data
const DUMMY_CALL_DURATION: ChartData[] = [
  { name: 'Mon', value: 245 },
  { name: 'Tue', value: 321 },
  { name: 'Wed', value: 278 },
  { name: 'Thu', value: 395 },
  { name: 'Fri', value: 412 },
  { name: 'Sat', value: 189 },
  { name: 'Sun', value: 156 }
]

const DUMMY_CALL_SUCCESS: ChartData[] = [
  { name: 'Completed', value: 78 },
  { name: 'Partial', value: 15 },
  { name: 'Failed', value: 7 }
]

const DUMMY_AGENT_PERFORMANCE: ChartData[] = [
  { name: 'Agent-001', value: 92 },
  { name: 'Agent-002', value: 88 },
  { name: 'Agent-003', value: 85 },
  { name: 'Agent-004', value: 91 },
  { name: 'Agent-005', value: 87 }
]

type ActiveChart = 'call-duration' | 'call-success' | 'agent-performance'

function App() {
  const [email, setEmail] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeChart, setActiveChart] = useState<ActiveChart>('call-duration')
  const [isLoading, setIsLoading] = useState(false)
  const [previousChartData, setPreviousChartData] = useState<ChartData[] | null>(null)

  const [callDurationData, setCallDurationData] = useState<ChartData[]>(DUMMY_CALL_DURATION)
  const [callSuccessData, setCallSuccessData] = useState<ChartData[]>(DUMMY_CALL_SUCCESS)
  const [agentPerformanceData, setAgentPerformanceData] = useState<ChartData[]>(DUMMY_AGENT_PERFORMANCE)

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      loadCustomData(savedEmail)
    }
  }, [])

  const loadCustomData = async (userEmail: string) => {
    setIsLoading(true)
    try {
      // Load call duration data
      const durationData = await getCustomData(userEmail, 'call-duration')
      if (durationData) {
        setCallDurationData(durationData.customData)
      }

      // Load call success data
      const successData = await getCustomData(userEmail, 'call-success')
      if (successData) {
        setCallSuccessData(successData.customData)
      }

      // Load agent performance data
      const performanceData = await getCustomData(userEmail, 'agent-performance')
      if (performanceData) {
        setAgentPerformanceData(performanceData.customData)
      }
    } catch (error) {
      console.error('Error loading custom data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (chartType: ActiveChart) => {
    if (!email) {
      setActiveChart(chartType)
      setShowEmailModal(true)
    } else {
      setActiveChart(chartType)
      checkAndShowEdit(chartType)
    }
  }

  const checkAndShowEdit = async (chartType: ActiveChart) => {
    if (!email) return
    try {
      const data = await getCustomData(email, chartType)
      setPreviousChartData(data?.customData || null)
    } catch (error) {
      console.error('Error checking previous data:', error)
    }
    setShowEditModal(true)
  }

  const handleEmailSubmit = async (userEmail: string) => {
    setEmail(userEmail)
    localStorage.setItem('userEmail', userEmail)
    setShowEmailModal(false)
    await loadCustomData(userEmail)
    setShowEditModal(true)
  }

  const handleChartUpdate = async (newData: ChartData[]) => {
    if (!email) return

    setIsLoading(true)
    try {
      const customization: UserChartCustomization = {
        email,
        chartType: activeChart,
        customData: newData
      }

      await saveCustomData(customization)

      // Update local state
      switch (activeChart) {
        case 'call-duration':
          setCallDurationData(newData)
          break
        case 'call-success':
          setCallSuccessData(newData)
          break
        case 'agent-performance':
          setAgentPerformanceData(newData)
          break
      }

      setShowEditModal(false)
    } catch (error) {
      console.error('Error saving custom data:', error)
      alert('Error saving data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getChartData = (chartType: ActiveChart) => {
    switch (chartType) {
      case 'call-duration':
        return callDurationData
      case 'call-success':
        return callSuccessData
      case 'agent-performance':
        return agentPerformanceData
      default:
        return []
    }
  }

  const getChartType = (chartType: ActiveChart) => {
    switch (chartType) {
      case 'call-duration':
        return 'line' as const
      case 'call-success':
        return 'pie' as const
      case 'agent-performance':
        return 'bar' as const
      default:
        return 'line' as const
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Voice Agent Analytics</h1>
              <p className="text-slate-400 mt-2">Real-time call performance monitoring and insights</p>
            </div>
            {email && (
              <div className="text-right">
                <p className="text-slate-300 text-sm">Logged in as</p>
                <p className="text-white font-semibold">{email}</p>
                <button
                  onClick={() => {
                    setEmail(null)
                    localStorage.removeItem('userEmail')
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Total Calls (Today)</p>
            <h3 className="text-4xl font-bold text-blue-400">1,245</h3>
            <p className="text-slate-400 text-sm mt-2">↑ 12% from yesterday</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Success Rate</p>
            <h3 className="text-4xl font-bold text-green-400">94.2%</h3>
            <p className="text-slate-400 text-sm mt-2">↑ 2.3% improvement</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Avg Call Duration</p>
            <h3 className="text-4xl font-bold text-purple-400">4m 32s</h3>
            <p className="text-slate-400 text-sm mt-2">↓ 8 seconds faster</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsChart
            title="Call Duration Analysis"
            data={callDurationData}
            type={getChartType('call-duration')}
            onEdit={() => handleEditClick('call-duration')}
          />
          <AnalyticsChart
            title="Call Success Distribution"
            data={callSuccessData}
            type={getChartType('call-success')}
            onEdit={() => handleEditClick('call-success')}
          />
          <AnalyticsChart
            title="Agent Performance Scores"
            data={agentPerformanceData}
            type={getChartType('agent-performance')}
            onEdit={() => handleEditClick('agent-performance')}
          />
        </div>
      </main>

      {/* Modals */}
      <EmailModal
        isOpen={showEmailModal && !email}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isLoading}
      />

      {showEditModal && (
        <EditChartModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleChartUpdate}
          currentData={getChartData(activeChart)}
          chartTitle={
            activeChart === 'call-duration'
              ? 'Call Duration Analysis'
              : activeChart === 'call-success'
              ? 'Call Success Distribution'
              : 'Agent Performance Scores'
          }
          previousData={previousChartData}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default App
