import { TVL } from 'constants/keyNames'
import { TokenBalanceWithPrice } from 'data/types'
import { useQueryClient } from 'react-query'

interface PropsType {
  type: string
  base: string
  pair: string
  lpDecimals: number
}

const Tvl = ({ type, base, pair, lpDecimals }: PropsType) => {
  const queryClient = useQueryClient()
  const tvl: TokenBalanceWithPrice = queryClient.getQueryData([
    type,
    base,
    pair,
    TVL,
  ]) || { balance: '0', price: '0' }
  return (
    <>
      <p className="primary-color font-td-3">
        {(Number(tvl && tvl.balance) / Math.pow(10, lpDecimals)).toFixed(2)}
      </p>
      <p className="tertiary-color font-td-4">
        $
        {(
          (Number(tvl && tvl.balance) / Math.pow(10, lpDecimals)) *
          Number(tvl && tvl.price)
        ).toFixed(2)}{' '}
        total
      </p>
    </>
  )
}

export default Tvl
