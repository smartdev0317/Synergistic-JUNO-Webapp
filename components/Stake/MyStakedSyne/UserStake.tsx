import { useState, useEffect } from 'react'
import { useWallet } from '@noahsaso/cosmodal'
import { toast } from 'react-toastify'

import CustomButton from 'components/Buttons/CustomButton'
import CustomButtonOutline from 'components/Buttons/CustomButtonOutline'
import TokenImg from 'components/TokenImg'
import { getReadableBalance } from 'data/utils'
import syne from 'components/images/png/syne.png'
import { useClaimSyne, useRestakeSyne } from 'data/executes/syneStakingExecutes'
import bigDecimal from 'js-big-decimal'

const UserStake = ({
  data,
  active,
  onClick,
}: {
  data: any
  active: boolean
  onClick: Function
}) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [reward, setReward] = useState('0')
  useEffect(() => {
    if (data.stakedAt) {
      const timer1 = setInterval(() => {
        const currentTime = Date.now() / 1000
        const timeLeft = data.period * 86400 * 30 + data.stakedAt - currentTime
        setTimeLeft(timeLeft)
        const reward = new bigDecimal(data.reward.user_reward)
          .add(new bigDecimal(data.reward.pending_reward))
          .add(
            new bigDecimal(data.totalDailyReward)
              .multiply(new bigDecimal(currentTime))
              .divide(new bigDecimal(data.lastDistributionTime), data.decimals)
          )
          .getValue()
        setReward(reward)
      }, 1000)
      return () => clearInterval(timer1)
    } else {
      setTimeLeft(0)
    }
  }, [
    data.stakedAt,
    data.reward,
    data.totalVesyneBalance,
    data.lastDistributionTime,
    data.decimals,
    data.period,
    data.totalDailyReward,
  ])
  const restakeMutation = useRestakeSyne()
  useEffect(() => {
    if (restakeMutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${restakeMutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {restakeMutation.data?.transactionHash?.slice(0, 5)}...
            {restakeMutation.data?.transactionHash?.slice(
              restakeMutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [restakeMutation.isSuccess, restakeMutation.data])

  useEffect(() => {
    if (restakeMutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [restakeMutation.isLoading])

  useEffect(() => {
    if (restakeMutation.isError) {
      if (restakeMutation.error instanceof Error) {
        toast.dismiss()
        toast.error(restakeMutation.error.message)
      }
    }
  }, [restakeMutation.isError, restakeMutation.error])

  const executeRestake = () => {
    restakeMutation.mutate({
      duration: data.period,
    })
  }

  const claimMutation = useClaimSyne()
  useEffect(() => {
    if (claimMutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${claimMutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {claimMutation.data?.transactionHash?.slice(0, 5)}...
            {claimMutation.data?.transactionHash?.slice(
              claimMutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [claimMutation.isSuccess, claimMutation.data])

  useEffect(() => {
    if (claimMutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [claimMutation.isLoading])

  useEffect(() => {
    if (claimMutation.isError) {
      if (claimMutation.error instanceof Error) {
        toast.dismiss()
        toast.error(claimMutation.error.message)
      }
    }
  }, [claimMutation.isError, claimMutation.error])

  const executeClaim = () => {
    claimMutation.mutate({
      duration: data.period,
    })
  }
  return (
    <div
      className="w-[900px] lg:w-full secondary-bg-color border-liquidity grid grid-cols-12 gap-4 md:gap-8 px-[16px] py-[15px] mb-[8px]"
      onClick={() => onClick()}
    >
      <div className="col-span-2 flex h-full items-center gap-3">
        <TokenImg icon={syne} iconAlt={'SYNE'} size="big" />
        <p className="font-td-1-2">{data.period} month</p>
      </div>
      <div className="col-span-1 flex h-full items-center justify-start">
        <p className="primary-color font-td-3">{data.apr || '0%'}</p>
      </div>
      <div className="col-span-2 flex h-full items-center justify-start">
        <p className="primary-color font-td-3">
          {getReadableBalance(reward, data.decimals, 2)} SYNE
        </p>
      </div>
      <div className="col-span-2 flex h-full items-center justify-start">
        <p className="primary-color font-td-3">
          {getReadableBalance(data.vesyne, data.decimals, 2)} of max{' '}
          {getReadableBalance(data.vesyne_max, data.decimals, 2)}
        </p>
      </div>
      <div className="col-span-2 flex h-full items-start flex-col justify-center">
        <p className="primary-color font-td-3">
          {getReadableBalance(data.amount, data.decimals, 2)}
        </p>
        <p className="tertiary-color font-td-4">$ TBD</p>
      </div>
      <div className="col-span-3 h-full relative">
        <div
          className={`flex xl:justify-end lg:justify-start h-full items-center gap-[4px] ${
            active ? 'opacity-30 xl:opacity-100' : ''
          }`}
        >
          <div className="border-button-small px-[5px] vesyne-staking-color">
            <p className="font-timer">{Math.floor(timeLeft / 2592000)}M</p>
          </div>
          <div className="border-button-small px-[5px] vesyne-staking-color">
            <p className="font-timer">
              {Math.floor((timeLeft % 2592000) / 86400)}D
            </p>
          </div>
          <div className="border-button-small px-[5px] vesyne-staking-color">
            <p className="font-timer">
              {Math.floor((timeLeft % 86400) / 3600)}H
            </p>
          </div>
          <div className="border-button-small px-[5px] vesyne-staking-color">
            <p className="font-timer">{Math.floor((timeLeft % 3600) / 60)}M</p>
          </div>
          <div className="border-button-small px-[5px] vesyne-staking-color">
            <p className="font-timer">{Math.floor(timeLeft % 60)}S</p>
          </div>
          <div className={`hidden ${active ? "xl:flex" : ""} items-center gap-2`}>
            <CustomButtonOutline
              disabled={false}
              onClick={() => executeRestake()}
              text={'Restake'}
              small={true}
              whitespace={true}
            />
            <CustomButton
              disabled={false}
              onClick={() => executeClaim()}
              text={'Harvest'}
              small={true}
            />
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 gap-[10px] ${
            active ? 'flex xl:hidden' : 'hidden'
          }`}
        >
          <CustomButtonOutline
            disabled={false}
            onClick={() => executeRestake()}
            text={'Restake'}
            small={true}
            whitespace={true}
          />
          <CustomButton
            disabled={false}
            onClick={() => executeClaim()}
            text={'Harvest'}
            small={true}
          />
        </div>
      </div>
    </div>
  )
}

export default UserStake
