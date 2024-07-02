import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'
import Image, { StaticImageData } from 'next/image'

import { getReadableBalance } from 'data/utils'
import TokenInput from '../../TokenInput'
import ContainerTab from 'components/containers/ContainerTab'
import ContainerTabDescription from 'components/containers/ContainerTabDescription'
import ContainerTabAction from 'components/containers/ContainerTabAction'
import CustomButton from 'components/Buttons/CustomButton'
import { autoCompoundPools } from 'constants/autoCompoundPools'
import { AUTO_COMPOUND_POOLS, VAULT_USER_REWARD } from 'constants/keyNames'
import { useClaimRewardAutoCompoundPoolToken } from 'data/executes/liquidStakingPoolsExecutes'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  index: number
}

export const LiquidStakingvaultClaimTab = ({
  icon,
  iconAlt,
  index,
}: PropsType) => {
  const autoCompoundPool = autoCompoundPools[index]
  const btoken = autoCompoundPool.btoken
  const { note, detailTitle, description } = autoCompoundPool.claim
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const rewardData: any = queryClient.getQueryData([
    AUTO_COMPOUND_POOLS,
    index,
    walletAddress,
    VAULT_USER_REWARD,
  ])
  const rewardBalance = rewardData?.pending_reward
  const claimMutation = useClaimRewardAutoCompoundPoolToken(index)

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
      vault: autoCompoundPool.bvault,
      token: btoken.address,
    })
  }

  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <CustomButton
          disabled={Number(rewardBalance) === 0 || claimMutation.isLoading}
          onClick={executeClaim}
          text={'Claim!'}
        />
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

  return (
    <ContainerTab>
      <ContainerTabDescription note={note}>
        <p className="font-td-5 primary-color mb-[5px]">{detailTitle}</p>
        <div className="flex relative items-center mt-2">
          <Image src={icon} width={19} height={19} alt={iconAlt} />
          <p className="font-td-5 tertiary-color font-normal ml-2">
            {getReadableBalance(rewardBalance, btoken.decimals)}
          </p>
          <p className="font-td-5 tertiary-color font-normal ml-2">
            {btoken.symbol}
          </p>
        </div>
      </ContainerTabDescription>
      <ContainerTabAction>
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Claim</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
            <p className="font-td-7 primary-color">
              {rewardBalance
                ? getReadableBalance(rewardBalance, btoken.decimals)
                : '-'}{' '}
              {btoken.symbol}
            </p>
          </div>
        </div>
        <TokenInput
          icon={icon}
          iconAlt={iconAlt}
          amount={'100%'}
          totalBalance={''}
          onChange={() => {}}
          className="mb-[20px]"
          disabled={true}
        />
        <RenderBtn />
        <p className="font-td-9 tertiary-color">{description}</p>
      </ContainerTabAction>
    </ContainerTab>
  )
}
