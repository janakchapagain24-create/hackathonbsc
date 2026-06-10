import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet } from 'lucide-react'
import axios from 'axios'

export function PortfolioChart() {
  const [balance, setBalance] = useState('0.00')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([
    { time: '00:00', value: 1000 },
    { time: '04:00', value: 1100 },
    { time: '08:00', value: 1050 },
    { time: '12:00', value: 1200 },
    { time: '16:00', value: 1150 },
    { time: '20:00', value: 1300 },
    { time: '24:00', value: 1350 },
  ])

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/wallet/balance')
      setBalance(response.data.balance || '0.00')
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">💼 Portfolio</h2>
        <Wallet className="w-5 h-5 text-blue-400" />
      </div>
      <div className="space-y-4">
        <div className="text-center bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Balance</p>
          <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
            ${loading ? '...' : balance}
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-700 rounded p-2 text-center">
            <p className="text-gray-400">24h Change</p>
            <p className="text-green-400 font-bold">+5.2%</p>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <p className="text-gray-400">7d Change</p>
            <p className="text-green-400 font-bold">+12.8%</p>
          </div>
        </div>
      </div>
    </div>
  )
}