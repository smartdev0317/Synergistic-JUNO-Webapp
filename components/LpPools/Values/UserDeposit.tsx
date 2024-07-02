import { useQueryClient } from 'react-query'
import { useWallet } from '@noahsaso/cosmodal'

import { TokenBalanceWithPrice } from 'data/types'
import { TVL, VAULT_USER_DEPOSIT } from 'constants/keyNames'

interface PropsType {
  type: string
  base: string
  pair: string
  lpDecimals: number
}

const UserDeposit = ({ type, base, pair, lpDecimals }: PropsType) => {
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()
  const tvl: TokenBalanceWithPrice = queryClient.getQueryData([
    type,
    base,
    pair,
    TVL,
  ]) || { balance: '0', price: '0' }
  const userDeposit: string =
    queryClient.getQueryData([
      type,
      base,
      pair,
      walletAddress,
      VAULT_USER_DEPOSIT,
    ]) || '0'
  return (
    <>
      <p className="primary-color font-td-3">
        {(Number(userDeposit) / Math.pow(10, lpDecimals)).toFixed(2)}
      </p>
      <p className="tertiary-color font-td-4">
        $
        {(
          (Number(userDeposit) / Math.pow(10, lpDecimals)) *
          Number(tvl && tvl.price)
        ).toFixed(2)}{' '}
        total
      </p>
    </>
  )
}

export default UserDeposit
