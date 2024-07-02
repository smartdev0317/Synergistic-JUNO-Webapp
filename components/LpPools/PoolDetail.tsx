import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useWallet } from '@noahsaso/cosmodal'

import { LoopLpFarmDataType } from 'data/types'
import { DepositTab } from './Tab/DepositTab'
import { WithdrawTab } from './Tab/WithdrawTab'
import { ClaimTab } from './Tab/ClaimTab'
import MoneyIcon from '../images/MoneyIcon'
import InfoIcon from '../images/InfoIcon'
import LpTokenImg from '../LpTokenImg'
import ConvertIcon from 'components/images/ConvertIcon'
import Apr from './Values/Apr'
import UserDeposit from './Values/UserDeposit'
import Tvl from './Values/Tvl'
import EstWeeklyYield from './Values/EstWeeklyYield'
import RewardValue from './Values/RewardValue'
import { PoolInfoTab } from './Tab/PoolInfoTab'
import { useFetchLpPool } from 'data/queries/lpPoolsQueries'
import { LP_POOLS, VAULT_USER_DEPOSIT } from 'constants/keyNames'

interface PropsType {
  opened: boolean
  onToggle: Function
  data: LoopLpFarmDataType
  hideEmpty: boolean
  search: string
}

const PoolDetail = ({
  opened,
  onToggle,
  data,
  hideEmpty,
  search,
}: PropsType) => {
  useFetchLpPool(data)
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()
  const [selectedTab, selectTab] = useState(1)
  const {
    name,
    pair,
    lpAddr,
    lpDecimals,
    asset0,
    asset1,
    /* auto,  **/ base,
    rewards,
  } = data
  const userDeposit: string =
    queryClient.getQueryData([
      LP_POOLS,
      base,
      pair,
      walletAddress,
      VAULT_USER_DEPOSIT,
    ]) || '0'

  const renderDetail = () => {
    switch (selectedTab) {
      case 0:
        return <div></div>
      case 1:
        return (
          <DepositTab
            type={LP_POOLS}
            icon1={asset0.icon}
            icon2={asset1.icon}
            icon1Alt={asset0.symbol}
            icon2Alt={asset1.symbol}
            name={name}
            lpAddr={lpAddr}
            lpDecimals={lpDecimals}
            pair={pair}
            base={base}
          />
        )
      case 2:
        return (
          <ClaimTab
            type={LP_POOLS}
            icon1={asset0.icon}
            icon2={asset1.icon}
            icon1Alt={asset0.symbol}
            icon2Alt={asset1.symbol}
            pair={pair}
            lpAddr={lpAddr}
            base={base}
            rewards={rewards}
          />
        )
      case 3:
        return (
          <WithdrawTab
            type={LP_POOLS}
            icon1={asset0.icon}
            icon2={asset1.icon}
            icon1Alt={asset0.symbol}
            icon2Alt={asset1.symbol}
            pair={pair}
            name={name}
            lpAddr={lpAddr}
            lpDecimals={lpDecimals}
            base={base}
          />
        )
      case 4:
        return (
          <PoolInfoTab name={name} pair={pair} lpAddr={lpAddr} base={base} />
        )
    }
  }
  const checkVisible = () => {
    if (hideEmpty && Number(userDeposit) === 0) return 'hidden'
    if (
      search &&
      name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1
    )
      return 'hidden'
    return ''
  }
  return (
    <div
      className={`${
        opened
          ? 'w-[768px] md:w-full second-bg-detail-color border-liquidity-detail mb-[8px]'
          : 'w-[768px] md:w-full secondary-bg-color border-liquidity mb-[8px]'
      } ${checkVisible()}`}
    >
      <button
        className={`w-full grid grid-cols-12 gap-4 md:gap-8 px-[16px] py-[15px]`}
        onClick={() => onToggle()}
      >
        <div className="col-span-3 flex h-full items-center gap-3">
          <LpTokenImg
            icon1={asset0.icon}
            icon2={asset1.icon}
            icon1Alt={asset0.symbol}
            icon2Alt={asset1.symbol}
          />
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <p className="font-td-1">{name}</p>
              {/* {
                                auto ? 
                                    <p className="font-td-badge badge-bg-color badge-color-1 border-button-small px-[5px] ml-1">auto</p> : 
                                    <p className="font-td-badge badge-bg-color badge-color-2 border-button-small px-[5px] ml-1">manual</p>
                            } */}
            </div>
            <p className="font-td-2 tertiary-color">{`LP on ${base.toUpperCase()}`}</p>
          </div>
        </div>
        <div className="col-span-1 flex h-full items-center justify-end sm:justify-start">
          <Apr type={LP_POOLS} base={base} pair={pair} />
        </div>
        <div className="col-span-2 flex h-full items-center flex-col sm:items-start justify-end md:justify-start">
          <UserDeposit
            type={LP_POOLS}
            base={base}
            pair={pair}
            lpDecimals={lpDecimals}
          />
        </div>
        <div className="col-span-2 flex h-full items-center flex-col sm:items-start justify-end md:justify-start">
          <Tvl
            type={LP_POOLS}
            base={base}
            pair={pair}
            lpDecimals={lpDecimals}
          />
        </div>
        <div className="col-span-2 flex h-full items-center">
          <EstWeeklyYield
            type={LP_POOLS}
            base={base}
            pair={pair}
            lpDecimals={lpDecimals}
          />
        </div>
        <div className="col-span-2 flex justify-end h-full items-center">
          <RewardValue type={LP_POOLS} base={base} pair={pair} />
        </div>
      </button>
      <div
        className={`${
          !opened && 'hidden'
        } w-full px-[16px] pb-[14px] border-liquidity-detailed `}
      >
        <div className="grid grid-cols-12 md:grid-cols-12 mb-[5px] detail-bg-color-1 border-liquidity">
          <button
            className={`${
              selectedTab === 1 && 'detail-btn-bg-color-1'
            } flex items-center col-span-3 justify-center py-[13px] m-1 border-button`}
            onClick={() => selectTab(1)}
          >
            <MoneyIcon active={selectedTab === 1} />
            <p
              className={`${
                selectedTab === 1 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Deposit
            </p>
          </button>
          <button
            className={`${
              selectedTab === 2 && 'detail-btn-bg-color-1'
            } flex items-center col-span-3 justify-center py-[13px] m-1 border-button`}
            onClick={() => selectTab(2)}
          >
            <ConvertIcon active={selectedTab === 2} />
            <p
              className={`${
                selectedTab === 2 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Claim
            </p>
          </button>
          <button
            className={`${
              selectedTab === 3 && 'detail-btn-bg-color-1'
            } flex items-center col-span-3 justify-center py-[13px] m-1 border-button`}
            onClick={() => selectTab(3)}
          >
            <MoneyIcon active={selectedTab === 3} />
            <p
              className={`${
                selectedTab === 3 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Withdraw
            </p>
          </button>
          <button
            className={`${
              selectedTab === 4 && 'detail-btn-bg-color-1'
            } flex items-center col-span-3 justify-center py-[13px] m-1 border-button`}
            onClick={() => selectTab(4)}
          >
            <InfoIcon active={selectedTab === 4} width="20px" />
            <p
              className={`${
                selectedTab === 4 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Pool Info
            </p>
          </button>
        </div>
        {renderDetail()}
      </div>
    </div>
  )
}
export default PoolDetail
