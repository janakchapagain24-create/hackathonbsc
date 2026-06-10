import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import axios from 'axios'

export function TradeHistory() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTradeHistory()
  }, [])

  const fetchTradeHistory = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/trading/history?limit=5')
      setTrades(response.data.trades || [])
    } catch (error) {
      console.error('Error fetching trade history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📜 Recent Trades</h2>
        <Clock className="w-5 h-5 text-purple-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-3 text-gray-400">Symbol</th>
              <th className="text-left py-2 px-3 text-gray-400">Side</th>
              <th className="text-left py-2 px-3 text-gray-400">Amount</th>
              <th className="text-left py-2 px-3 text-gray-400">Price</th>
              <th className="text-left py-2 px-3 text-gray-400">Time</th>
              <th className="text-left py-2 px-3 text-gray-400">TX Hash</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No trades yet
                </td>
              </tr>
            ) : (
              trades.map((trade: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-3 font-semibold">{trade.symbol}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.side === 'BUY' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 px-3">{trade.amount}</td>
                  <td className="py-3 px-3">${trade.executedPrice?.toFixed(2)}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3">
                    <a
                      href={`https://bscscan.com/tx/${trade.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate max-w-xs inline-block"
                    >
                      {trade.txHash?.substring(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}