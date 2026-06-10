import { useState, useEffect } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard'
import { Header } from './components/Header'
import { WalletProvider } from './context/WalletContext'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = () => {
    // Trust Wallet connection logic
    // Check if wallet is accessible
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header connected={connected} setConnected={setConnected} />
        <Dashboard />
      </div>
    </WalletProvider>
  )
}

export default App