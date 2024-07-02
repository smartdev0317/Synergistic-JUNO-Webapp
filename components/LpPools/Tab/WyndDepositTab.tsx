import { useState, useEffect } from 'react'
import { StaticImageData } from 'next/image'
import { useQueryClient } from 'react-query'
import bigDecimal from 'js-big-decimal'
import { toast } from 'react-toastify'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'

import LeftArrowIcon from '../../images/LeftArrowIcon'
import LpTokenInput from '../../LpTokenInput'
import CustomButton from 'components/Buttons/CustomButton'
import { LOOP, TOKEN_BALANCE, WYND } from 'constants/keyNames'
import { LOOP_POOL_LINK, WYND_POOL_LINK } from 'constants/link'
import { useDepositLpToken } from 'data/executes/lpPoolsExecutes'

interface PropsType {
  type: string
  icon1: StaticImageData
  icon2: StaticImageData
  icon1Alt: string
  icon2Alt: string
  name: string
  lpAddr: string
  lpDecimals: number
  pair: string
  base: string
}

export const WyndDepositTab = ({
  type,
  icon1,
  icon2,
  icon1Alt,
  icon2Alt,
  name,
  lpAddr,
  lpDecimals,
  pair,
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
  const totalBalance: string =
    queryClient.getQueryData([
      type,
      base,
      lpAddr,
      walletAddress,
      TOKEN_BALANCE,
    ]) || '0'

  const mutation = useDepositLpToken(type, base, pair, lpAddr)

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

  const renderDepositDetail = () => {
    switch (base) {
      case LOOP:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            Head over to Loop Finance Dex to provide liquidity ($
            {icon1Alt.toUpperCase()} and ${icon2Alt.toUpperCase()}) and receive
            LP tokens, then deposit the LP tokens here to earn boosted yield!
            <br />
            <br />
            LOOP has NO UNBONDING period
          </p>
        )
      case WYND:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            Head over to Wynd Dex to provide liquidity ($
            {icon1Alt.toUpperCase()} and ${icon2Alt.toUpperCase()}) and receive
            LP tokens, then deposit the LP tokens here to earn boosted yield!
            <br />
            <br />
            WYND has UNBONDING period`
          </p>
        )
    }
  }
  const getLinkUrl = () => {
    switch (base) {
      case LOOP:
        return LOOP_POOL_LINK
      case WYND:
        return WYND_POOL_LINK
    }
  }
  const getLinkText = () => {
    switch (base) {
      case LOOP:
        return 'Go to LOOP'
      case WYND:
        return 'Go to WYND'
    }
  }
  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center gap-3">
          <CustomButton
            disabled={
              Number(amount) === 0 ||
              new bigDecimal(amount).compareTo(new bigDecimal(totalBalance)) ===
                1 ||
              mutation.isLoading
            }
            onClick={executeDeposit}
            text={'Deposit'}
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
  const executeDeposit = () => {
    if (Number(amount) === 0) return
    mutation.mutate(
      new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, lpDecimals)))
        .floor()
        .getValue()
    )
  }
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 mt-[5px] mb-[9px] text-start gap-6 md:h-[175px]">
      <div className="col-span-6">
        <p className="font-td-1 primary-color mb-[3px]">
          Deposit your {name} LP
        </p>
        <div className="detail-bg-color-3 border-small p-[16px] h-[165px] relative">
          <p className="font-td-5 primary-color mb-[5px]">Need LP Tokens?</p>
          {renderDepositDetail()}
          <a
            className="font-td-5 fourth-color flex absolute bottom-[16px]"
            href={getLinkUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <span className="mr-1">{getLinkText()}</span>
            <LeftArrowIcon width={'14px'} />
          </a>
        </div>
      </div>
      <div className="col-span-6">
        <div className="flex justify-between mt-[17px] mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Deposit your {name} LP</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">
              BAL: {totalBalance}
            </p>
          </div>
        </div>
        <LpTokenInput
          icon1={icon1}
          icon2={icon2}
          icon1Alt={icon1Alt}
          icon2Alt={icon2Alt}
          amount={amount}
          totalBalance={totalBalance}
          onChange={(newAmount: string) => changeAmount(newAmount)}
          className="mb-[20px]"
        />
        <RenderBtn />
      </div>
    </div>
  )
}
