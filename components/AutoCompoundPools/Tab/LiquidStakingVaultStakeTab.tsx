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
import LeftArrowIcon from '../../images/LeftArrowIcon'
import TokenInput from '../../TokenInput'
import ContainerTab from 'components/containers/ContainerTab'
import ContainerTabDescription from 'components/containers/ContainerTabDescription'
import ContainerTabAction from 'components/containers/ContainerTabAction'
import CustomButton from 'components/Buttons/CustomButton'
import { autoCompoundPools } from 'constants/autoCompoundPools'
import { AUTO_COMPOUND_POOLS, BTOKEN_BALANCE } from 'constants/keyNames'
import { useDepositAutoCompoundPoolToken } from 'data/executes/liquidStakingPoolsExecutes'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  index: number
  onChange: Function
}

export const LiquidStakingVaultStakeTab = ({
  icon,
  iconAlt,
  index,
  onChange,
}: PropsType) => {
  const autoCompoundPool = autoCompoundPools[index]
  const btoken = autoCompoundPool.btoken
  const { note, detailTitle, detail, linkText, baseToken, description } =
    autoCompoundPool.stake
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const mutation = useDepositAutoCompoundPoolToken(index)
  const tokenBalance: any = queryClient.getQueryData([
    AUTO_COMPOUND_POOLS,
    index,
    walletAddress,
    BTOKEN_BALANCE,
  ])
  const [amount, setAmount] = useState('0')
  const changeAmount = (newAmount: string) => {
    if (!isNaN(Number(newAmount))) {
      console.log(isNaN(Number(newAmount)))
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

  const executeDeposit = () => {
    if (Number(amount) === 0) return
    mutation.mutate({
      vault: autoCompoundPool.bvault,
      amount: new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, btoken.decimals)))
        .getValue(),
      token: btoken.address,
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
                new bigDecimal(tokenBalance).divide(
                  new bigDecimal(Math.pow(10, btoken.decimals)),
                  tokenBalance.length
                )
              ) === 1 ||
              mutation.isLoading
            }
            onClick={executeDeposit}
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
    <ContainerTab>
      <ContainerTabDescription note={note}>
        <p className="font-td-5 primary-color mb-[5px]">{detailTitle}</p>
        <p className="font-td-5 tertiary-color font-normal">{detail}</p>
        <button
          className="font-td-5 fourth-color flex absolute bottom-[16px]"
          onClick={() => onChange()}
        >
          <span className="mr-1">{linkText}</span>
          <LeftArrowIcon width={'14px'} />
        </button>
      </ContainerTabDescription>
      <ContainerTabAction>
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Stake {btoken.symbol}</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
            <p className="font-td-7 primary-color">
              {tokenBalance
                ? getReadableBalance(tokenBalance, btoken.decimals)
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
              tokenBalance,
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
