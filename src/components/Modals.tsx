import React, { useState } from 'react'
import type { ChartData } from '../types'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  isLoading?: boolean
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    onSubmit(email)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
        <p className="text-slate-300 mb-6">
          Your custom chart values will be saved against your email address. You can update them anytime.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="your.email@example.com"
              className="input-field"
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditChartModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ChartData[]) => void
  currentData: ChartData[]
  chartTitle: string
  previousData?: ChartData[] | null
  isLoading?: boolean
}

export const EditChartModal: React.FC<EditChartModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentData,
  chartTitle,
  previousData,
  isLoading = false
}) => {
  const [data, setData] = useState<ChartData[]>(currentData)
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false)

  const handleValueChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const newData = [...data]
    if (field === 'value') {
      newData[index] = { ...newData[index], value: parseFloat(newValue) || 0 }
    } else {
      newData[index] = { ...newData[index], name: newValue }
    }
    setData(newData)
  }

  const handleSubmit = () => {
    if (previousData) {
      setShowOverwriteWarning(true)
    } else {
      onSubmit(data)
    }
  }

  const confirmOverwrite = () => {
    onSubmit(data)
    setShowOverwriteWarning(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{chartTitle} - Edit Values</h2>

        {showOverwriteWarning ? (
          <div className="space-y-4">
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
              <p className="text-yellow-200 font-semibold mb-4">Previous Values Found</p>
              <p className="text-slate-300 text-sm mb-4">
                We found previous custom values for this chart. Here's what you had:
              </p>
              <div className="bg-slate-900 rounded p-3 mb-4 max-h-32 overflow-y-auto">
                {previousData?.map((item, idx) => (
                  <div key={idx} className="text-sm text-slate-300 py-1">
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Are you sure you want to overwrite these values with your new data?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOverwriteWarning(false)}
                disabled={isLoading}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={confirmOverwrite}
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50 bg-yellow-600 hover:bg-yellow-700"
              >
                {isLoading ? 'Saving...' : 'Yes, Overwrite'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {data.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleValueChange(index, 'name', e.target.value)}
                    placeholder="Category name"
                    className="input-field flex-1"
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="input-field w-24"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
