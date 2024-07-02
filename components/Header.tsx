import ConnectWallet from 'components/ConnectWallet'
import TokenPrices from './TokenPrices';
import Logo from './Logo';
import { useFetchUserTokenBalances } from 'data/queries/common';
// import { useCosmwasmClient } from 'hooks/cosmwasm';
// import {useEffect} from "react"

function Header() {

  useFetchUserTokenBalances()

  // const cosmwasmClient = useCosmwasmClient()
  // console.log(cosmwasmClient)

  // useEffect(() => {
  //   if (cosmwasmClient) cosmwasmClient.queryContractSmart("juno10spmqj6vzlvceykju2g3zkra6ny8xv89lx8dlya8vv6yg287wjqqmvtja6", {"total_stake":{}}).then((data) => console.log(data))
  // }, [cosmwasmClient])

  return (
    <div className="header-bg-color px-[5px] lg:px-0">
      <nav className="relative container mx-auto h-[72px]">
        <Logo />
        <TokenPrices isMobile={false} />
        <ConnectWallet />
      </nav>
      <div className="container mx-auto">
        <TokenPrices isMobile={true} />
      </div>
    </div>
  )
}

export default Header
