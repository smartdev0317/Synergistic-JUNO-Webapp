import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'

import { reducedWalletAddress } from '../data/utils'
import WalletIcon from './images/WalletIcon'

const ConnectWallet = () => {
  const { connect, disconnect } = useWalletManager()
  const { status: walletStatus, error, address } = useWallet()
  // const { walletAddress, connectWallet, disconnect, loading, error } = useSigningClient()
  const [disconnected, setDisconnected] = useState(false)

  useEffect(() => {
    if (
      !address &&
      walletStatus === WalletConnectionStatus.ReadyForConnection &&
      !error &&
      !disconnected
    ) {
      connect()
    }
  }, [address, walletStatus, error, connect, disconnected])

  useEffect(() => {
    if (address) {
      window.addEventListener('keplr_keystorechange', connect)
      return () => {
        window.removeEventListener('keplr_keystorechange', connect)
      }
    }
  }, [address, connect])

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error?.message)
    }
  }, [error])

  const disconnectWallet = () => {
    setDisconnected(true)
    disconnect()
  }

  return (
    <div className="flex absolute h-full right-0 top-0 items-center max-w-full">
      {address ? (
        <button
          onClick={() => disconnectWallet()}
          className="btn disabled rounded-full"
        >
          <WalletIcon />
          <span className="ml-2 hidden sm:block font-wallet">
            {reducedWalletAddress(address)}
          </span>
          <span className="ml-2 sm:hidden font-wallet">
            {reducedWalletAddress(address, 2)}
          </span>
        </button>
      ) : walletStatus === WalletConnectionStatus.Connecting ? (
        <button
          className="btn disabled font-wallet-small sm:font-wallet rounded-full"
          onClick={connect}
        >
          Connecting...
        </button>
      ) : (
        <button
          className="btn capitalize rounded-full"
          onClick={connect}
          disabled={walletStatus === WalletConnectionStatus.Initializing}
        >
          <WalletIcon />
          <span className="ml-2 font-wallet-small sm:font-wallet">Connect</span>
        </button>
      )}
    </div>
  )
}

export default ConnectWallet
