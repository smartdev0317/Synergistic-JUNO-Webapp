import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import PoolDetail from './PoolDetail'
import ToggleBtn from '../ToggleBtn'
import Search from '../Search'

import InfoIcon from 'components/images/InfoIcon'
import { loopLpPools, wyndLpPools } from 'constants/lpPools'
import WyndPoolDetail from './WyndPoolDetail'
import { LOOP, WYND } from 'constants/keyNames'

const AllPools = () => {
  const [index, setIndex] = useState(-1)
  const [selectedType, setType] = useState(LOOP)
  const [hideEmpty, setHideEmpty] = useState(false)
  const [searchText, setSearchText] = useState('')

  const toggleIndex = (type: string, _index: number) => {
    if (_index === index && selectedType === type) {
      setIndex(-1)
    }
    else {
      setIndex(_index)
      setType(type)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-[24px] w-full">
        <p className="font-section text-left">All Pools</p>
        <div className="items-center flex">
          <div className="flex">
            <div className="flex items-center mr-[20px] md:mr-[43px]">
              <p className="font-td-1 mr-[9px] hidden xs:block">Hide Empty</p>
              <ToggleBtn
                checked={hideEmpty}
                toggleStatus={() => setHideEmpty(!hideEmpty)}
              />
            </div>
            <Search
              className="w-[160px] sm:w-[232px]"
              value={searchText}
              onChange={(value: string) => {
                setSearchText(value)
              }}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="w-[768px] md:w-full grid grid-cols-12 gap-4 text-left font-th secondary-color mb-[14px] px-[16px] items-center">
          <p className="col-span-3">POOL NAME</p>
          <div className="flex items-center col-span-1">
            <span className="mr-2 w-[22px]">APR</span>
            <div data-tooltip-id="apr">
              <InfoIcon width={'14px'} />
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
        {loopLpPools.map((pool, i) => (
          <PoolDetail
            key={'lp-pool-' + i}
            opened={index === i && selectedType === LOOP}
            onToggle={() => toggleIndex(LOOP, i)}
            data={pool}
            hideEmpty={hideEmpty}
            search={searchText.trim()}
          />
        ))}
        {wyndLpPools.map((pool, i) => (
          <WyndPoolDetail
            key={'lp-pool-' + i}
            opened={index === i && selectedType === WYND}
            onToggle={() => toggleIndex(WYND, i)}
            data={pool}
            hideEmpty={hideEmpty}
            search={searchText.trim()}
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

export default AllPools
