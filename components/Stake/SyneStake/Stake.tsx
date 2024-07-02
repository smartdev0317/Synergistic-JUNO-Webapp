import { useEffect, useState } from 'react'

import TokenInput from 'components/TokenInput'
import syne from 'components/images/png/syne.png'
import { getReadableBalance } from 'data/utils'
import bigDecimal from 'js-big-decimal'
import PeriodBar from './PeriodBar'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'
import CustomButton from 'components/Buttons/CustomButton'
import { ONE_MONTH, SYNE, TOKEN_BALANCE } from 'constants/keyNames'
import { STAKING_PERIODS } from 'constants/setting'
import { useStakeSyne } from 'data/executes/syneStakingExecutes'
import { SyneBalanceData } from 'data/types'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

const Stake = () => {
  const [amount, setAmount] = useState('0')
  const [period, setPeriod] = useState(STAKING_PERIODS[ONE_MONTH])
  const { connect } = useWalletManager()
  const queryClient = useQueryClient()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const syneBalanceData: SyneBalanceData | undefined = queryClient.getQueryData(
    [TOKEN_BALANCE, SYNE, walletAddress]
  )
  const syneBalance = syneBalanceData
    ? new bigDecimal(syneBalanceData.balance)
        .subtract(new bigDecimal(syneBalanceData.locked))
        .getValue()
    : '0'
  const mutation = useStakeSyne()
  const changeAmount = (newAmount: string) => {
    if (!isNaN(Number(newAmount))) {
      if (newAmount === '' || newAmount === '0') setAmount('0')
      else if (newAmount[1] === '.') setAmount(newAmount)
      else setAmount(newAmount.replace(/^0+/, ''))
    }
  }
  const decimal = syneBalanceData?.decimals || 6
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

  const executeStake = () => {
    mutation.mutate({
      amount: new bigDecimal(amount).multiply(new bigDecimal(Math.pow(10, decimal))).floor().getValue(),
      duration: period,
    })
  }
  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center gap-3">
          <CustomButton
            disabled={
              Number(amount) === 0 ||
              new bigDecimal(amount).compareTo(
                new bigDecimal(syneBalance).divide(
                  new bigDecimal(Math.pow(10, decimal)),
                  syneBalance.length
                )
              ) === 1 ||
              mutation.isLoading
            }
            onClick={executeStake}
            text={'Stake now'}
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

  return (
    <div>
      <p className="text-left font-18-26-700-hk">Stake SYNE</p>
      <p className="text-left font-13-18-500-hk tertiary-color">
        Stake your SYNE to earn veSYNE to get rewards and voting power
      </p>
      <div className="flex justify-between mr-[5px] mb-[9px] mt-[24px]">
        <p className="font-td-5 primary-color">Amount</p>
        <div className="flex items -center">
          <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
          <p className="font-td-7 primary-color">
            {syneBalance ? getReadableBalance(syneBalance, 6) : '-'} SYNE
          </p>
        </div>
      </div>
      <TokenInput
        icon={syne}
        iconAlt="SYNE"
        amount={amount}
        totalBalance={new bigDecimal(syneBalance)
          .divide(new bigDecimal(Math.pow(10, 6)), 6)
          .getValue()}
        onChange={(newAmount: string) => changeAmount(newAmount)}
        disabled={false}
      />
      <p className="text-left font-13-18-700-hk mt-[28px]">Staking Period</p>
      <PeriodBar
        period={period}
        onChange={(newPeriod: number) => setPeriod(newPeriod)}
      />
      <RenderBtn />
    </div>
  )
}

export default Stake
