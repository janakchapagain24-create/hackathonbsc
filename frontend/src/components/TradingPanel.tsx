import { useState } from 'react'
import { Send, Zap } from 'lucide-react'
import axios from 'axios'

export function TradingPanel() {
  const [autoTrade, setAutoTrade] = useState(false)
  const [riskLevel, setRiskLevel] = useState('medium')
  const [executing, setExecuting] = useState(false)
  const [txHash, setTxHash] = useState('')

  const handleExecuteTrade = async () => {
    if (!txHash) {
      setExecuting(true)
      try {
        const response = await axios.post('/api/trading/execute', {
          symbol: 'BTC',
          side: 'BUY',
          amount: 0.1,
          signal: 'BUY',
        })
        const data = response.data
        setTxHash(data.txHash)
        console.log('Trade executed:', data)
      } catch (error) {
        console.error('Trade execution error:', error)
        alert('Trade execution failed')
      } finally {
        setExecuting(false)
      }
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">⚡ Trading Controls</h2>
        <Zap className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
          <span className="font-semibold">Auto Trading</span>
          <button
            onClick={() => setAutoTrade(!autoTrade)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              autoTrade ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                autoTrade ? 'translate-x-6' : ''
              }`}
            ></div>
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2 font-semibold">Risk Level</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white hover:border-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="low">🟢 Low (1-2%)</option>
            <option value="medium">🟡 Medium (2-5%)</option>
            <option value="high">🔴 High (5-10%)</option>
          </select>
        </div>

        <button
          onClick={handleExecuteTrade}
          disabled={executing}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 py-3 rounded-lg font-bold mt-6 transition-all flex items-center justify-center gap-2 text-white"
        >
          {executing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Executing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {txHash ? 'Trade Executed ✓' : 'Execute Trade'}
            </>
          )}
        </button>

        {txHash && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-3 text-sm">
            <p className="text-green-200">✓ Trade successful!</p>
            <p className="text-gray-300 text-xs mt-1 truncate">TX: {txHash}</p>
          </div>
        )}
      </div>
    </div>
  )
}