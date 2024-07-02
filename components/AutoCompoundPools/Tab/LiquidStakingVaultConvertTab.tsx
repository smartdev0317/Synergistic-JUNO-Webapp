import { useState, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import bigDecimal from 'js-big-decimal'
import { toast } from 'react-toastify'
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
} from '@noahsaso/cosmodal'
import { StaticImageData } from 'next/image'

import { getReadableBalance } from 'data/utils'
import LeftArrowIcon from '../../images/LeftArrowIcon'
import TokenInput from '../../TokenInput'
import ContainerTab from 'components/containers/ContainerTab'
import ContainerTabDescription from 'components/containers/ContainerTabDescription'
import ContainerTabAction from 'components/containers/ContainerTabAction'
import CustomButton from 'components/Buttons/CustomButton'
import CustomButtonOutline from 'components/Buttons/CustomButtonOutline'
import { AUTO_COMPOUND_POOLS, TOKEN_BALANCE } from 'constants/keyNames'
import { autoCompoundPools } from 'constants/autoCompoundPools'
import {
  useConvertAndStakeAutoCompoundPoolToken,
  useConvertAutoCompoundPoolToken,
} from 'data/executes/liquidStakingPoolsExecutes'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  index: number
}

export const LiquidStakingVaultConvertTab = ({
  icon,
  iconAlt,
  index,
}: PropsType) => {
  const autoCompoundPool = autoCompoundPools[index]
  const token = autoCompoundPool.token
  const btoken = autoCompoundPool.btoken
  const {
    note,
    detailTitle,
    detail,
    linkUrl,
    linkText,
    baseToken,
    description,
  } = autoCompoundPool.convert
  const queryClient = useQueryClient()
  const { connect } = useWalletManager()
  const { address: walletAddress, status: walletStatus } = useWallet()
  const mutation = useConvertAutoCompoundPoolToken(index)
  const mass_mutation = useConvertAndStakeAutoCompoundPoolToken(index)
  const tokenBalance: any = queryClient.getQueryData([
    AUTO_COMPOUND_POOLS,
    index,
    walletAddress,
    TOKEN_BALANCE,
  ])
  const [amount, setAmount] = useState('0')
  const changeAmount = (newAmount: string) => {
    if (!isNaN(Number(newAmount))) {
      if (newAmount === '' || newAmount === '0') setAmount('0')
      else if (
        newAmount.indexOf('.') !== -1 &&
        newAmount.length - newAmount.indexOf('.') - 1 > token.decimals
      )
        return
      else if (newAmount[1] === '.') setAmount(newAmount)
      else setAmount(newAmount.replace(/^0+/, ''))
    }
  }

  useEffect(() => {
    if (mutation.isLoading) toast.loading('Pending', { autoClose: false })
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
    if (mass_mutation.isLoading) toast.loading('Pending', { autoClose: false })
    if (mass_mutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${mass_mutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {mass_mutation.data?.transactionHash?.slice(0, 5)}...
            {mass_mutation.data?.transactionHash?.slice(
              mass_mutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [
    mutation.isLoading,
    mutation.isSuccess,
    mutation.data,
    mass_mutation.isLoading,
    mass_mutation.isSuccess,
    mass_mutation.data,
  ])

  useEffect(() => {
    if (mutation.isError) {
      if (mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(mutation.error.message)
      }
    }
    if (mass_mutation.isError) {
      if (mass_mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(mass_mutation.error.message)
      }
    }
  }, [
    mutation.isError,
    mutation.error,
    mass_mutation.isError,
    mass_mutation.error,
  ])

  const executeConvert = () => {
    if (Number(amount) === 0) return
    mutation.mutate({
      converter: autoCompoundPool.converterAndStaker,
      amount: new bigDecimal(amount)
        .multiply(new bigDecimal(Math.pow(10, token.decimals)))
        .getValue(),
      token: token.address,
    })
  }
  const executeConvertAndStake = () => {
    if (Number(amount) === 0) return
    mass_mutation.mutate({
      convert: {
        converter: autoCompoundPool.converterAndStaker,
        amount: new bigDecimal(amount)
          .multiply(new bigDecimal(Math.pow(10, token.decimals)))
          .getValue(),
        token: token.address,
      },
      stake: {
        vault: autoCompoundPool.bvault,
        amount: new bigDecimal(amount)
          .multiply(new bigDecimal(Math.pow(10, btoken.decimals)))
          .getValue(),
        token: btoken.address,
      },
    })
  }

  const RenderBtn = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center gap-3">
          <CustomButtonOutline
            disabled={
              Number(amount) === 0 ||
              new bigDecimal(amount).compareTo(
                new bigDecimal(tokenBalance).divide(
                  new bigDecimal(Math.pow(10, token.decimals)),
                  tokenBalance?.length || 0
                )
              ) === 1 ||
              mutation.isLoading
            }
            onClick={executeConvert}
            text={'Convert'}
            whitespace={true}
          />
          <CustomButton
            disabled={
              Number(amount) === 0 ||
              new bigDecimal(amount).compareTo(
                new bigDecimal(tokenBalance).divide(
                  new bigDecimal(Math.pow(10, token.decimals)),
                  tokenBalance?.length || 0
                )
              ) === 1 ||
              mass_mutation.isLoading
            }
            onClick={executeConvertAndStake}
            text={'Convert & Stake'}
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
        <a
          className="font-td-5 fourth-color flex absolute bottom-[16px]"
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="mr-1">{linkText}</span>
          <LeftArrowIcon width={'14px'} />
        </a>
      </ContainerTabDescription>
      <ContainerTabAction>
        <div className="flex justify-between mr-[5px] mb-[9px]">
          <p className="font-td-5 primary-color">Convert {baseToken}</p>
          <div className="flex items -center">
            <p className="font-td-6 secondary-color mr-[6px]">BAL:</p>
            <p className="font-td-7 primary-color">
              {tokenBalance
                ? getReadableBalance(tokenBalance, token.decimals)
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
            getReadableBalance(tokenBalance, token.decimals, token.decimals) ||
            '0'
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
