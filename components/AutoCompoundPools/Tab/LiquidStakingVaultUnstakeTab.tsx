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

import { getReadableBalance } from 'data/utils'
import TokenInput from '../../TokenInput'
import ContainerTab from 'components/containers/ContainerTab'
import ContainerTabDescription from 'components/containers/ContainerTabDescription'
import ContainerTabAction from 'components/containers/ContainerTabAction'
import CustomButton from 'components/Buttons/CustomButton'
import { autoCompoundPools } from 'constants/autoCompoundPools'
import { AUTO_COMPOUND_POOLS, VAULT_USER_DEPOSIT } from 'constants/keyNames'
import { useWithdrawAutoCompoundPoolToken } from 'data/executes/liquidStakingPoolsExecutes'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  index: number
}

export const LiquidStakingVaultUnstakeTab = ({
  icon,
  iconAlt,
  index,
}: PropsType) => {
  const autoCompoundPool = autoCompoundPools[index]
  const btoken = autoCompoundPool.btoken
  const { note, detailTitle, detail, baseToken, description } =
    autoCompoundPool.unstake
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const depositBalance: any = queryClient.getQueryData([
    AUTO_COMPOUND_POOLS,
    index,
    walletAddress,
    VAULT_USER_DEPOSIT,
  ])
  const withdrawMutation = useWithdrawAutoCompoundPoolToken(index)
  const [amount, setAmount] = useState('0')
  const changeAmount = (newAmount: string) => {
    if (!isNaN(Number(newAmount))) {
      if (newAmount === '' || newAmount === '0') setAmount('0')
      else if (
        newAmount.indexOf('.') !== -1 &&
        newAmount.length - newAmount.indexOf('.') - 1 > btoken.decimals
      )
        return
      else if (newAmount[1] === '.') setAmount(newAmount)
      else setAmount(newAmount.replace(/^0+/, ''))
    }
  }

  useEffect(() => {
    if (withdrawMutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${withdrawMutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {withdrawMutation.data?.transactionHash?.slice(0, 5)}...
            {withdrawMutation.data?.transactionHash?.slice(
              withdrawMutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [withdrawMutation.isSuccess, withdrawMutation.data])

  useEffect(() => {
    if (withdrawMutation.isLoading) {
      toast.loading('Pending', { autoClose: false })
    }
  }, [withdrawMutation.isLoading])

  useEffect(() => {
    if (withdrawMutation.isError) {
      if (withdrawMutation.error instanceof Error) {
        toast.dismiss()
        toast.error(withdrawMutation.error.message)
      }
    }
  }, [withdrawMutation.isError, withdrawMutation.error])

  const executeWithdraw = () => {
    if (Number(amount) === 0) return
    withdrawMutation.mutate({
      vault: autoCompoundPool.bvault,
      amount: new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, btoken.decimals)))
        .getValue(),
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
                new bigDecimal(depositBalance).divide(
                  new bigDecimal(Math.pow(10, btoken.decimals)),
                  depositBalance.length
                )
              ) === 1 ||
              withdrawMutation.isLoading
            }
            onClick={executeWithdraw}
            text={'Unstake now'}
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
    <ContainerTab>
      <ContainerTabDescription note={note}>
        <p className="font-td-5 primary-color mb-[5px]">{detailTitle}</p>
        <p className="font-td-5 tertiary-color font-normal">{detail}</p>
      </ContainerTabDescription>
      <ContainerTabAction>
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Unstake {btoken.symbol}</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
            <p className="font-td-7 primary-color">
              {depositBalance
                ? getReadableBalance(depositBalance, btoken.decimals)
                : '-'}{' '}
              {baseToken}
            </p>
          </div>
        </div>
        <TokenInput
          icon={icon}
          iconAlt={iconAlt}
          amount={amount}
          totalBalance={
            getReadableBalance(
              depositBalance,
              btoken.decimals,
              btoken.decimals
            ) || '0'
          }
          onChange={(newAmount: string) => changeAmount(newAmount)}
          className="mb-[20px]"
        />
        <RenderBtn />
        <p className="font-td-9 tertiary-color">{description}</p>
      </ContainerTabAction>
    </ContainerTab>
  )
}
