import { useState, useEffect } from 'react'
import { useWallet } from '@noahsaso/cosmodal'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import bigDecimal from 'js-big-decimal'

import CustomButton from 'components/Buttons/CustomButton'
import CustomButtonOutline from 'components/Buttons/CustomButtonOutline'
import { SYNE_STAKING } from 'constants/keyNames'
import { useFetchUserSyneStaking } from 'data/queries/syneQueries'
import UserStake from './UserStake'
import { getReadableBalance } from 'data/utils'
import { useClaimAllSyne, useRestakeAllSyne } from 'data/executes/syneStakingExecutes'

const MyStakedSyne = () => {
  useFetchUserSyneStaking()
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()
  const [activeIndex, setActiveIndex] = useState(-1)
  const userStaked: any = queryClient.getQueryData([
    SYNE_STAKING,
    walletAddress,
  ])
  const totalReward = userStaked
    ? userStaked.reduce((a: string, b: any) => {
        return new bigDecimal(b.reward.user_reward)
          .add(new bigDecimal(b.reward.pending_reward))
          .add(new bigDecimal(a))
          .getValue()
      }, '0')
    : '0'

  const restakeAllMutation = useRestakeAllSyne()
  useEffect(() => {
    if (restakeAllMutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${restakeAllMutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {restakeAllMutation.data?.transactionHash?.slice(0, 5)}...
            {restakeAllMutation.data?.transactionHash?.slice(
              restakeAllMutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [restakeAllMutation.isSuccess, restakeAllMutation.data])

  useEffect(() => {
    if (restakeAllMutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [restakeAllMutation.isLoading])

  useEffect(() => {
    if (restakeAllMutation.isError) {
      if (restakeAllMutation.error instanceof Error) {
        toast.dismiss()
        toast.error(restakeAllMutation.error.message)
      }
    }
  }, [restakeAllMutation.isError, restakeAllMutation.error])

  const executeRestakeAll = () => {
    const durations = []
    for (let data of userStaked) {
      if (Number(data.reward.user_reward) + Number(data.reward.pending_reward) > 0) durations.push(data.period)
    }
    restakeAllMutation.mutate({
      durations: durations,
    })
  }

  const claimAllMutation = useClaimAllSyne()
  useEffect(() => {
    if (claimAllMutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${claimAllMutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {claimAllMutation.data?.transactionHash?.slice(0, 5)}...
            {claimAllMutation.data?.transactionHash?.slice(
              claimAllMutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [claimAllMutation.isSuccess, claimAllMutation.data])

  useEffect(() => {
    if (claimAllMutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [claimAllMutation.isLoading])

  useEffect(() => {
    if (claimAllMutation.isError) {
      if (claimAllMutation.error instanceof Error) {
        toast.dismiss()
        toast.error(claimAllMutation.error.message)
      }
    }
  }, [claimAllMutation.isError, claimAllMutation.error])

  const executeClaimAll = () => {
    const durations = []
    for (let data of userStaked) {
      if (Number(data.reward.user_reward) + Number(data.reward.pending_reward) > 0) durations.push(data.period)
    }
    claimAllMutation.mutate({
      durations: durations,
    })
  }

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:items-end mt-[51px]">
        <div className="flex flex-col items-start mb-[12px] gap-[8px]">
          <p className="font-24-30-700-hk">My Staked SYNE</p>
          <p className="font-16-24-500-hk tertiary-color">
            Total rewards to be restaked/harvested:{' '}
            <span className="primary-color">
              {getReadableBalance(totalReward, 6, 2)}
            </span>
          </p>
        </div>
        <div className="flex justify-start gap-[17px]">
          <CustomButtonOutline
            disabled={Number(totalReward) === 0}
            onClick={() => executeRestakeAll()}
            text={'Restake All'}
            whitespace
          />
          <CustomButton
            disabled={Number(totalReward) === 0}
            onClick={() => executeClaimAll()}
            text={'Harvest All'}
          />
        </div>
      </div>
      <div className="overflow-x-auto mt-[34px] mb-[60px]">
        <div className="w-[900px] lg:w-full grid grid-cols-12 gap-4 text-left font-th secondary-color mb-[14px] px-[16px] items-center">
          <p className="col-span-2">TERM</p>
          <p className="col-span-1">APR</p>
          <p className="col-span-2">MY REWARDS</p>
          <p className="col-span-2">veSYNE</p>
          <p className="col-span-2">TOTAL VALUE</p>
          <p className="col-span-3 text-end">Remaining</p>
        </div>
        {userStaked ? (
          userStaked.map((each: any, index: number) => (
            <UserStake
              key={index}
              data={each}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default MyStakedSyne
