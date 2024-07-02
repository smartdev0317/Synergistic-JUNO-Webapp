import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import LiquidStakingVaultDetail from './LiquidStakingVaultDetail'
import InfoIcon from 'components/images/InfoIcon'
import { useFetchLiquidStakingPools } from 'data/queries/liquidStakingPoolsQueries'
import { autoCompoundPools } from 'constants/autoCompoundPools'
// import { useQueryClient } from 'react-query';
// import { AUTO_COMPOUND_POOLS } from 'utils/constants';
// import { AutoCompoundFarmDataType } from 'data/types';

const LiquidStakingVaults = () => {
  useFetchLiquidStakingPools()

  const [acindex, setAcindex] = useState(-1)

  const toggleAcindex = (_index: number) => {
    if (_index === acindex) setAcindex(-1)
    else setAcindex(_index)
  }

  return (
    <>
      <p className="font-section text-left mb-[24px]">Liquid Staking Vaults</p>
      <div className="overflow-x-auto">
        <div className="w-[768px] md:w-full grid grid-cols-12 gap-4 text-left font-th secondary-color mb-[14px] px-[16px] items-center">
          <p className="col-span-3">POOL NAME</p>
          <div className="flex items-center col-span-1">
            <span className="mr-2 w-[22px]">APR</span>
            <div data-tooltip-id="apr">
              <InfoIcon width={'14px'} height={'14px'} />
            </div>
          </div>
          <p className="col-span-2">YOUR DEPOSIT</p>
          <div className="flex items-center col-span-2">
            <span className="mr-2 w-[22px]">TVL</span>
            <div data-tooltip-id="tvl">
              <InfoIcon width={'14px'} />
            </div>
          </div>
          <div className="flex items-center col-span-2">
            <span className="mr-2 md:w-[78px] lg:w-[115px]">
              EST WEEKLY YIELD
            </span>
            <div data-tooltip-id="est-weekly-yield">
              <InfoIcon width={'14px'} />
            </div>
          </div>
          <div className="flex items-center col-span-2 justify-end">
            <span className="mr-2 md:w-[60px] lg:w-[97px]">YOUR REWARDS</span>
            <div data-tooltip-id="reward">
              <InfoIcon width={'14px'} />
            </div>
          </div>
        </div>
        {autoCompoundPools &&
          autoCompoundPools.map((each, index) => (
            <LiquidStakingVaultDetail
              key={index}
              index={index}
              opened={acindex === index}
              onToggle={() => toggleAcindex(index)}
              data={each}
            />
          ))}
      </div>
      
      <ReactTooltip
        id="apr"
        place="top"
        render={({ content, activeAnchor }) => (
          <p className="tertiary-color font-13-18-500-hk text-left">
            APR comes from native protocol
            <br />
            Rewards and future SYNE
            <br />
            rewards.
          </p>
        )}
        style={{ backgroundColor: '#252747', borderRadius: '12px' }}
      />
      <ReactTooltip
        id="tvl"
        place="top"
        render={({ content, activeAnchor }) => (
          <p className="tertiary-color font-13-18-500-hk text-left">
            Total Value Locked: The total
            <br />
            value deposited in underlying
            <br />
            assets and USD is displayed.
          </p>
        )}
        style={{ backgroundColor: '#252747', borderRadius: '12px' }}
      />
      <ReactTooltip
        id="est-weekly-yield"
        place="top"
        render={({ content, activeAnchor }) => (
          <p className="tertiary-color font-13-18-500-hk text-left">
            The estimated yield you will
            <br />
            receive from this pool on a<br />
            weekly basis. Yields are
            <br />
            calculated based on current
            <br />
            prices and may vary due to price
            <br />
            volatility.
          </p>
        )}
        style={{ backgroundColor: '#252747', borderRadius: '12px' }}
      />
      <ReactTooltip
        id="reward"
        place="top"
        render={({ content, activeAnchor }) => (
          <p className="tertiary-color font-13-18-500-hk text-left">
            Total claimable rewards that you
            <br />
            have accumulated from this pool.
          </p>
        )}
        style={{ backgroundColor: '#252747', borderRadius: '12px' }}
      />
    </>
  )
}

export default LiquidStakingVaults
