import { useState, useEffect } from 'react'
import { Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import axios from 'axios'

export function PerpsDashboard() {
  const [positions, setPositions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [collateral, setCollateral] = useState('100')
  const [selectedSymbol, setSelectedSymbol] = useState('1') // BTC
  const [executing, setExecuting] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  useEffect(() => {
    fetchPositions()
    fetchStats()
    const interval = setInterval(() => {
      fetchPositions()
      fetchStats()
    }, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/perps/positions')
      setPositions(response.data.positions || [])
    } catch (error) {
      console.error('Error fetching positions:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/perps/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleAutoExecute = async () => {
    setExecuting(true)
    try {
      const response = await axios.post('/api/perps/auto-execute', {
        symbol: selectedSymbol,
        collateralAmount: parseFloat(collateral),
      })

      if (response.data.success) {
        setLastResult(response.data)
        fetchPositions()
        fetchStats()
      } else {
        setLastResult({
          success: false,
          reason: response.data.reason,
          signal: response.data.signal,
        })
      }
    } catch (error) {
      console.error('Error executing perps:', error)
      setLastResult({
        success: false,
        reason: 'Failed to execute trade',
      })
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
            ⚡ Perps Trading Terminal
          </h1>
          <p className="text-gray-400">Auto-execute leverage trades based on strict signal validation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Positions</p>
            <p className="text-4xl font-bold text-blue-400">{stats?.positions?.totalPositions || 0}</p>
            <p className="text-gray-500 text-xs mt-2">Active trades on BSC</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Collateral</p>
            <p className="text-4xl font-bold text-green-400">${stats?.totalCollateral || '0.00'}</p>
            <p className="text-gray-500 text-xs mt-2">Margin deployed</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Risk Level</p>
            <p className={`text-4xl font-bold ${
              stats?.riskLevel === 'CRITICAL' ? 'text-red-400' :
              stats?.riskLevel === 'HIGH' ? 'text-orange-400' :
              stats?.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {stats?.riskLevel || 'MINIMAL'}
            </p>
            <p className="text-gray-500 text-xs mt-2">Avg Leverage: {stats?.averageLeverage || '0'}x</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Auto-Execute Panel */}
          <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 border border-purple-700 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Auto Execute</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Asset (CMC ID)</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="1">Bitcoin (BTC) - ID: 1</option>
                  <option value="1027">Ethereum (ETH) - ID: 1027</option>
                  <option value="5994">Cardano (ADA) - ID: 5994</option>
                  <option value="11419">Ripple (XRP) - ID: 11419</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Collateral ($)</label>
                <input
                  type="number"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
                  min="10"
                  max="10000"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <button
                onClick={handleAutoExecute}
                disabled={executing || !collateral}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-white"
              >
                {executing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Execute Auto Trade
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Last Result */}
          {lastResult && (
            <div className={`lg:col-span-2 rounded-lg p-6 border ${
              lastResult.success
                ? 'bg-green-900 border-green-700'
                : 'bg-red-900 border-red-700'
            }`}>
              <div className="flex items-start gap-3 mb-4">
                {lastResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${
                    lastResult.success ? 'text-green-200' : 'text-red-200'
                  }`}>
                    {lastResult.success ? '✓ Position Opened' : '✗ Trade Rejected'}
                  </h3>
                  {lastResult.success ? (
                    <div className="mt-3 space-y-2 text-sm text-green-100">
                      <p><strong>Side:</strong> {lastResult.position?.side} {lastResult.position?.leverage}x</p>
                      <p><strong>Entry:</strong> ${lastResult.position?.entryPrice.toFixed(2)}</p>
                      <p><strong>Signal:</strong> {lastResult.signal?.recommendation} ({lastResult.signal?.confidence})</p>
                      <p><strong>RSI:</strong> {lastResult.signal?.rsi}</p>
                      <p><strong>Details:</strong> {lastResult.details}</p>
                    </div>
                  ) : (
                    <div className="mt-2 text-red-100 text-sm">
                      <p className="mb-2"><strong>Reason:</strong> {lastResult.reason}</p>
                      {lastResult.signal && (
                        <div className="bg-red-800 rounded p-2 text-xs">
                          <p>Signal: {lastResult.signal.recommendation} ({(lastResult.signal.confidence * 100).toFixed(0)}%)</p>
                          <p>RSI: {lastResult.signal.rsi}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Positions Table */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Active Positions
          </h2>

          {positions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active positions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                    <th className="text-left py-3 px-4 text-gray-400">Side</th>
                    <th className="text-left py-3 px-4 text-gray-400">Leverage</th>
                    <th className="text-left py-3 px-4 text-gray-400">Collateral</th>
                    <th className="text-left py-3 px-4 text-gray-400">Entry Price</th>
                    <th className="text-left py-3 px-4 text-gray-400">Liquidation</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 font-semibold">{pos.symbol}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          pos.side === 'LONG'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{pos.leverage}x</td>
                      <td className="py-3 px-4">${pos.collateral.toFixed(2)}</td>
                      <td className="py-3 px-4">${pos.entryPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="text-orange-400 font-mono">${pos.liquidationPrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Risk Management Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Risk Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1"><strong>Signal Validation</strong></p>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>✓ Min confidence: 75%</li>
                <li>✓ RSI alignment required</li>
                <li>✓ MACD confirmation needed</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400 mb-1"><strong>Position Limits</strong></p>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>✓ Take Profit: +2.5%</li>
                <li>✓ Stop Loss: -1.0%</li>
                <li>✓ Auto-execution on TP/SL</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400 mb-1"><strong>Leverage Strategy</strong></p>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>✓ Extreme RSI: 5x leverage</li>
                <li>✓ Strong signal: 3x leverage</li>
                <li>✓ High confidence: 2x leverage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
