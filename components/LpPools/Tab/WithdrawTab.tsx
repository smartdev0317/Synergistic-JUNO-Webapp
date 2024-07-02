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
import { LOOP, VAULT_USER_DEPOSIT, WYND } from 'constants/keyNames'
import { LOOP_POOL_LINK, WYND_POOL_LINK } from 'constants/link'
import { useWithdrawLpToken } from 'data/executes/lpPoolsExecutes'

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

export const WithdrawTab = ({
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
  const mutation = useWithdrawLpToken(type, base, pair, lpAddr)

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
            <br />
            <br />
            WYND has UNBONDING period
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
  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center gap-3">
          <CustomButton
            disabled={Number(lpBalance) === 0 || mutation.isLoading}
            onClick={executeWithdraw}
            text={'Withdraw!'}
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
  const executeWithdraw = () => {
    mutation.mutate(
      new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, lpDecimals)))
        .floor()
        .getValue()
    )
  }
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 my-[17px] text-start gap-6 md:h-[190px]">
      <div className="col-span-6">
        <p className="font-td-1 primary-color mb-[17px]">
          Withdraw your {name} LP
        </p>
        <div className="detail-bg-color-3 border-small p-[16px] h-[165px] relative">
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
