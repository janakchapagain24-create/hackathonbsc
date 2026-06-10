import { createContext, useContext, ReactNode } from 'react'

interface WalletContextType {
  connected: boolean
  address: string | null
  balance: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletContext.Provider
      value={{
        connected: false,
        address: null,
        balance: '0',
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}