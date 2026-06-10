import { useState, useEffect } from 'react'
import { MarketSignals } from './MarketSignals'
import { TradingPanel } from './TradingPanel'
import { PortfolioChart } from './PortfolioChart'
import { TradeHistory } from './TradeHistory'
import axios from 'axios'

export function Dashboard() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30) // 30 seconds

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const fetchSignals = async () => {
    setLoading(true)
    try {
      // Fetch BTC signals as example
      const response = await axios.get('/api/cmc/signals/1')
      setSignals([response.data])
    } catch (error) {
      console.error('Error fetching signals:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <MarketSignals signals={signals} loading={loading} />
          <TradingPanel />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PortfolioChart />
          <TradeHistory />
        </div>
      </div>
    </div>
  )
}