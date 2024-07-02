import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useMedia } from 'use-media'
import { GasPrice } from '@cosmjs/stargate'
import {
  WalletManagerProvider,
  ChainInfoID,
  WalletType,
} from '@noahsaso/cosmodal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'

import Layout from 'components/Layout'
import ErrorBoundary from 'components/ErrorBoundary'
import 'styles/globals.css'
import { DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME } from 'constants/setting'
import { LOCAL_STORAGE_KEY } from 'constants/keyNames'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const isSmallScreen = useMedia({ maxWidth: 767 })

  return (
    <WalletManagerProvider
      defaultChainId={ChainInfoID.Juno1}
      enabledWalletTypes={[
        // WalletType.Leap,
        WalletType.Keplr,
        WalletType.KeplrMobile,
      ]}
      walletConnectClientMeta={{
        name: 'CosmodalExampleDAPP',
        description: 'A dapp using the cosmodal library.',
        url: 'https://cosmodal.example.app',
        icons: ['https://cosmodal.example.app/walletconnect.png'],
      }}
      localStorageKey={LOCAL_STORAGE_KEY}
      getSigningCosmWasmClientOptions={(chainInfo) => ({
        gasPrice: GasPrice.fromString(
          '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
        ),
      })}
      getSigningStargateClientOptions={(chainInfo) => ({
        gasPrice: GasPrice.fromString(
          '0.0025' + chainInfo.feeCurrencies[0].coinMinimalDenom
        ),
      })}
    >
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ErrorBoundary>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer
              position={isSmallScreen ? 'bottom-center' : 'top-right'}
              hideProgressBar={false}
              newestOnTop={true}
              theme="colored"
            />
            {/* <Toaster
            position={isSmallScreen ? 'bottom-center' : 'top-right'}
            toastOptions={{ duration: 3000 }}
            containerStyle={isSmallScreen ? { inset: 0 } : undefined}
          /> */}
          </ErrorBoundary>
        </RecoilRoot>
      </QueryClientProvider>
    </WalletManagerProvider>
  )
}
export default MyApp
