import { useQueryClient } from 'react-query'
import { useWallet } from '@noahsaso/cosmodal'

import { UserReward } from 'data/types'
import { getReadableValue } from 'data/utils'
import { VAULT_USER_REWARD } from 'constants/keyNames'

interface PropsType {
  type: string
  base: string
  pair: string
}

const WyndRewardValue = ({ type, base, pair }: PropsType) => {
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()
  const userReward: UserReward[] =
    queryClient.getQueryData([
      type,
      base,
      pair,
      walletAddress,
      VAULT_USER_REWARD,
    ]) || []
  const reward = userReward.reduce(
    (accumulator, currentValue) =>
      (
        (Number(currentValue.reward) * Number(currentValue.price)) /
          Math.pow(10, Number(currentValue.decimals)) +
        Number(accumulator)
      ).toFixed(6),
    '0'
  )
  return (
    <>
      <p className="primary-color font-td-3">${getReadableValue(reward)}</p>
    </>
  )
}

export default WyndRewardValue
