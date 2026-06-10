import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

export function MarketSignals({ signals, loading }: any) {
  if (loading) {
    return (
      <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-32"></div>
          <div className="h-40 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📊 Market Signals</h2>
        <AlertCircle className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="space-y-4">
        {signals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No signals available</p>
        ) : (
          signals.map((signal: any) => {
            const isBuy = signal.signal === 'BUY'
            return (
              <div key={signal.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-semibold block">{signal.id || 'BTC'}</span>
                    <span className="text-gray-400 text-sm">Bitcoin</span>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                    isBuy ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {signal.signal}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="font-semibold">{(signal.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isBuy ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${signal.confidence * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-gray-400 pt-2">{signal.reasoning}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}