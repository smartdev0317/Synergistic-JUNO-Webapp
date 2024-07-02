import { useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { useQueryClient } from 'react-query'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'
import { toast } from 'react-toastify'

import { TokenWithIconType, UserReward } from 'data/types'
import MultiTokenClaimInput from 'components/MultiTokenClaimInput'
import CustomButton from 'components/Buttons/CustomButton'
import { VAULT_USER_REWARD } from 'constants/keyNames'
import { useClaimLpToken } from 'data/executes/lpPoolsExecutes'

interface PropsType {
  type: string
  icon1: StaticImageData
  icon2: StaticImageData
  icon1Alt: string
  icon2Alt: string
  pair: string
  lpAddr: string
  base: string
  rewards: TokenWithIconType[]
}

export const ClaimTab = ({ type, pair, lpAddr, base, rewards }: PropsType) => {
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const userReward: UserReward[] =
    queryClient.getQueryData([
      type,
      base,
      pair,
      walletAddress,
      VAULT_USER_REWARD,
    ]) || []
  const mutation = useClaimLpToken(type, base, pair, lpAddr)

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${mutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {mutation.data?.transactionHash?.slice(0, 5)}...
            {mutation.data?.transactionHash?.slice(
              mutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [mutation.isSuccess, mutation.data])

  useEffect(() => {
    if (mutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [mutation.isLoading])

  useEffect(() => {
    if (mutation.isError) {
      if (mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(mutation.error.message)
      }
    }
  }, [mutation.isError, mutation.error])

  const renderRewardTokens = () => {
    return rewards.map((reward, index) => {
      let rewardData = userReward.find((each) => each.token === reward.addr)
      return (
        <div
          key={`"reward-"${base}-${pair}-${index}`}
          className="flex items-center gap-1"
        >
          <Image src={reward.icon} width="19" height="19" alt={reward.symbol} />
          <p className="font-td-5 tertiary-color font-normal">
            {rewardData?.reward || '0'}
          </p>
        </div>
      )
    })
  }
  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center gap-3">
          <CustomButton
            disabled={false}
            onClick={executeClaim}
            text={'Claim!'}
          />
        </div>
      )
    } else {
      if (walletStatus === WalletConnectionStatus.Connecting) {
        return (
          <CustomButton
            disabled={true}
            onClick={() => {}}
            text={'Conencting...'}
          />
        )
      } else {
        return (
          <CustomButton
            disabled={false}
            onClick={connect}
            text={'Connect Wallet'}
          />
        )
      }
    }
  }
  const executeClaim = () => {
    mutation.mutate()
  }
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 my-[17px] text-start gap-6 md:h-[158px]">
      <div className="col-span-6">
        <p className="font-td-1 primary-color mb-[17px]">Claim your rewards</p>
        <div className="detail-bg-color-3 border-small p-[16px] h-[129px] relative">
          <p className="font-td-5 primary-color mb-[5px]">Tokens:</p>
          {renderRewardTokens()}
        </div>
      </div>
      <div className="col-span-6">
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Claim</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
            <p className="font-td-7 primary-color">Tokens</p>
          </div>
        </div>
        <MultiTokenClaimInput rewards={rewards} className="mb-[20px]" />
        <RenderBtn />
      </div>
    </div>
  )
}
