import { useEffect, useState } from 'react'
import bigDecimal from 'js-big-decimal'

import { getReadableBalance } from 'data/utils'

interface RewardProps {
  className: string
  rewardData: any
  decimals: number
  totalStaked: string
  userStaked: string
}

export const Reward = (props: RewardProps) => {
  const { className, rewardData, decimals, totalStaked, userStaked } = props
  const [reward, setReward] = useState('0')
  const [autoIncrease, setAutoIncrease] = useState(false)
  useEffect(() => {
    if (rewardData) {
      if (rewardData.auto_increase) {
        setAutoIncrease(true)
        const timer = setInterval(() => {
          setReward(
            Number(totalStaked) === 0 ? "0" :
            new bigDecimal(rewardData.pending_reward)
              .add(
                new bigDecimal(rewardData.total_daily_reward)
                  .multiply(new bigDecimal(rewardData.vault_balance))
                  .divide(new bigDecimal(rewardData.total_balance), decimals)
                  .multiply(new bigDecimal(userStaked))
                  .divide(new bigDecimal(totalStaked), decimals)
                  .multiply(
                    new bigDecimal(Date.now() / 1000).subtract(
                      new bigDecimal(rewardData.last_distribution)
                    )
                  )
                  .divide(
                    new bigDecimal(rewardData.distribution_wait_time),
                    decimals
                  )
              )
              .getValue()
          )
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [rewardData, decimals, totalStaked, userStaked])
  return (
    <p className={className}>
      {autoIncrease
        ? `${
            getReadableBalance(reward, decimals, decimals) || 0
          }(${getReadableBalance(rewardData?.pending_reward || '0', decimals)})`
        : getReadableBalance(rewardData?.pending_reward, decimals) || 0}
    </p>
  )
}
