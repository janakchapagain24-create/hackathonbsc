export function Header({ connected, setConnected }: { connected: boolean; setConnected: (v: boolean) => void }) {
  const handleConnectWallet = async () => {
    try {
      // Connect to Trust Wallet
      // window.trustwallet?.request({ method: 'eth_requestAccounts' })
      setConnected(true)
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">🚀 BSC Trading Dashboard</h1>
          <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">Hackathon Ready</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold ${
            connected ? 'text-green-400' : 'text-red-400'
          }`}>
            {connected ? '✓ Connected' : '✗ Disconnected'}
          </span>
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
          >
            {connected ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  )
}