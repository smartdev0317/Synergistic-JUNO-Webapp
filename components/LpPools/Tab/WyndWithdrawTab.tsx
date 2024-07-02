import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import bigDecimal from 'js-big-decimal'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'
import { StaticImageData } from 'next/image'

import LeftArrowIcon from '../../images/LeftArrowIcon'
import LpTokenInput from '../../LpTokenInput'
import CustomButton from 'components/Buttons/CustomButton'
import {
  LOOP,
  VAULT_USER_CLAIM,
  VAULT_USER_DEPOSIT,
  WYND,
} from 'constants/keyNames'
import { LOOP_POOL_LINK, WYND_POOL_LINK } from 'constants/link'
import {
  useUnbondLpToken,
  useWithdrawLpToken,
} from 'data/executes/lpPoolsExecutes'
import { Claim } from 'data/types'

interface PropsType {
  type: string
  icon1: StaticImageData
  icon2: StaticImageData
  icon1Alt: string
  icon2Alt: string
  pair: string
  name: string
  lpAddr: string
  lpDecimals: number
  base: string
}

export const WyndWithdrawTab = ({
  type,
  icon1,
  icon2,
  icon1Alt,
  icon2Alt,
  pair,
  name,
  lpAddr,
  lpDecimals,
  base,
}: PropsType) => {
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const [claimLeftTime, setClaimLeftTime] = useState(0)
  const [amount, setAmount] = useState('0')
  const changeAmount = (newAmount: string) => {
    if (!isNaN(Number(newAmount))) {
      if (newAmount === '' || newAmount === '0') setAmount('0')
      else if (newAmount[1] === '.') setAmount(newAmount)
      else setAmount(newAmount.replace(/^0+/, ''))
    }
  }
  let lpBalance: string =
    queryClient.getQueryData([
      type,
      base,
      pair,
      walletAddress,
      VAULT_USER_DEPOSIT,
    ]) || '0'
  lpBalance = new bigDecimal(lpBalance)
    .divide(new bigDecimal(Math.pow(10, lpDecimals)), Number(lpDecimals))
    .getValue()
  let claims: Claim[] =
    queryClient.getQueryData([
      type,
      base,
      pair,
      walletAddress,
      VAULT_USER_CLAIM,
    ]) || []
  let claimBalance = new bigDecimal(claims[0]?.amount || '0')
    .divide(new bigDecimal(Math.pow(10, lpDecimals)), Number(lpDecimals))
    .getValue()
  const mutation = useWithdrawLpToken(type, base, pair, lpAddr)
  const unbond_mutation = useUnbondLpToken(type, base, pair, lpAddr)

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
    if (unbond_mutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${unbond_mutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {unbond_mutation.data?.transactionHash?.slice(0, 5)}...
            {unbond_mutation.data?.transactionHash?.slice(
              unbond_mutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    unbond_mutation.isSuccess,
    unbond_mutation.data,
  ])

  useEffect(() => {
    if (mutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
    if (unbond_mutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [mutation.isLoading, unbond_mutation.isLoading])

  useEffect(() => {
    if (mutation.isError) {
      if (mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(mutation.error.message)
      }
    }
    if (unbond_mutation.isError) {
      if (unbond_mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(unbond_mutation.error.message)
      }
    }
  }, [
    mutation.isError,
    mutation.error,
    unbond_mutation.isError,
    unbond_mutation.error,
  ])

  const executeWithdraw = () => {
    mutation.mutate(
      new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, lpDecimals)))
        .floor()
        .getValue()
    )
  }

  const executeUnbond = () => {
    unbond_mutation.mutate(
      new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, lpDecimals)))
        .floor()
        .getValue()
    )
  }

  const renderDetail = () => {
    switch (base) {
      case LOOP:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            Head over to LOOP Finance DEX to convert the ${name} LP tokens to
            the two base tokens(${icon1Alt.toUpperCase()} and $
            {icon2Alt.toUpperCase()})<br />
            <br />
            LOOP has NO UNBONDING period
          </p>
        )
      case WYND:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            Head over to WYND DEX to convert the ${name} LP tokens to the two
            base tokens(${icon1Alt.toUpperCase()} and ${icon2Alt.toUpperCase()})
          </p>
        )
    }
  }
  const renderLinkUrl = () => {
    switch (base) {
      case LOOP:
        return LOOP_POOL_LINK
      case WYND:
        return WYND_POOL_LINK
    }
  }
  const renderLinkText = () => {
    switch (base) {
      case LOOP:
        return 'Go to LOOP Finance DEX'
      case WYND:
        return 'Go to WYND DEX'
    }
  }
  useEffect(() => {
    if (claims[0]) {
      let release_at = Math.floor(
        Number(claims[0].release_at.at_time) / 1000000000
      )
      if (release_at > Date.now() / 1000)
        setClaimLeftTime(release_at - Math.floor(Date.now() / 1000))
      else {
        setClaimLeftTime(0)
      }
      let timer = setInterval(() => {
        if (release_at > Date.now() / 1000)
          setClaimLeftTime(release_at - Math.floor(Date.now() / 1000))
        else {
          setClaimLeftTime(0)
          clearInterval(timer)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [claims[0]])
  const RenderBtn = () => {
    if (walletAddress) {
      if (claims.length === 0)
        return (
          <div className="flex items-center gap-3 relative">
            <CustomButton
              disabled={Number(lpBalance) === 0 || mutation.isLoading}
              onClick={executeUnbond}
              text={'Unbond'}
            />
            <p className="absolute left-0 top-[50px] text-[12px] text-[#9496B7] font-medium">
              Your liquidity is locked for 43 days. The unbonding process starts
              after you click unbond.
              <br />
              After 43 days have passed from the time you unbonded, you can
              withdraw your LP tokens
            </p>
          </div>
        )
      else
        return (
          <div className="flex items-center gap-3 relative">
            <CustomButton
              disabled={claimLeftTime > 0 || mutation.isLoading}
              onClick={executeWithdraw}
              text={
                claimLeftTime > 86400
                  ? `${Math.ceil(
                      claimLeftTime / 86400
                    )} days unbonding left for ${Number(claimBalance)} LP`
                  : claimLeftTime > 3600
                  ? `${Math.ceil(
                      claimLeftTime / 3600
                    )} hours unbonding left for ${Number(claimBalance)} LP`
                  : claimLeftTime > 60
                  ? `${Math.ceil(
                      claimLeftTime / 60
                    )} minutes unbonding left for ${Number(claimBalance)} LP`
                  : claimLeftTime
                  ? `${Math.ceil(
                      claimLeftTime
                    )} seconds unbonding left for ${Number(claimBalance)} LP`
                  : `Withdraw ${claimBalance} LP!`
              }
            />
            <p className="absolute left-0 top-[50px] text-[12px] text-[#9496B7] font-medium">
              {claimLeftTime > 0
                ? 'Your liquidity is currently unbonding'
                : 'Withdraw your LP tokens now!'}
            </p>
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
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 my-[17px] text-start gap-6 md:h-[160px]">
      <div className="col-span-6">
        <p className="font-td-1 primary-color mb-[17px]">
          Withdraw your {name} LP
        </p>
        <div className="detail-bg-color-3 border-small p-[16px] h-[129px] relative">
          <p className="font-td-5 primary-color mb-[5px]">
            Want to convert back to base tokens?
          </p>
          {renderDetail()}
          <a
            className="font-td-5 fourth-color flex absolute bottom-[16px]"
            href={renderLinkUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <span className="mr-1">{renderLinkText()}</span>
            <LeftArrowIcon width={'14px'} />
          </a>
        </div>
      </div>
      <div className="col-span-6">
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Withdraw your {name} LP</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">
              BAL: {lpBalance}
            </p>
            {/* <p className="font-td-7 primary-color">{totalBalance ? getReadableBalance(totalBalance, 0) : "..."} lp</p> */}
          </div>
        </div>
        <LpTokenInput
          icon1={icon1}
          icon2={icon2}
          icon1Alt={icon1Alt}
          icon2Alt={icon2Alt}
          amount={amount}
          totalBalance={lpBalance}
          onChange={(newAmount: string) => changeAmount(newAmount)}
          className="mb-[20px]"
        />
        {/* {
                    unbond === false && (
                        <>
                            <button
                                className="detail-btn-bg-color-4 border-button font-wallet w-full px-[37px] py-[12px] mb-[12px]"
                            >
                                Unbond
                            </button>
                            <p className="font-td-9 tertiary-color">{unbondDescription}</p>
                        </>
                    )
                }
                {
                    unbond === true && left > 0 && (
                        <>
                            <button
                                className="detail-btn-bg-color-4 border-button font-wallet w-full px-[37px] py-[12px] mb-[12px]"
                                disabled
                            >
                                {left} Unbonding Left
                            </button>
                            <p className="font-td-9 tertiary-color">{unbondingDescription}</p>
                        </>
                    )
                }
                {
                    unbond === true && left === 0 && (
                        <>
                            <button
                                className="detail-btn-bg-color-4 border-button font-wallet w-full px-[37px] py-[12px] mb-[12px]"
                            >
                                Withdraw LP!
                            </button>
                            <p className="font-td-9 tertiary-color">{withdrawDescription}</p>
                        </>
                    )
                } */}
        <RenderBtn />
      </div>
    </div>
  )
}
