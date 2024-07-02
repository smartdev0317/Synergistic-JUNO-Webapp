import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import MoneyIcon from 'components/images/MoneyIcon'
import ConvertIcon from 'components/images/ConvertIcon'
import Stake from './Stake'
import BuyAndStake from './BuyAndStake'

const VeSyneStake = () => {
  const [selectedTab, selectTab] = useState(0)
  const renderTab = () => {
    switch (selectedTab) {
      case 0:
        return <Stake />
      case 1:
        return <BuyAndStake />
    }
  }
  return (
    <div className="overflow-x-auto">
      <div className="w-[440px] xs:w-full h-[490px] vesyne-staking-color border-12 px-[23px] pt-[32px] pb-[21px]">
        <div className="grid grid-cols-12 mb-[28px] detail-bg-color-1 border-liquidity">
          <button
            className={`${
              selectedTab === 0 && 'detail-btn-bg-color-1'
            } flex items-center col-span-6 justify-center py-[13px] m-1 border-button`}
            onClick={() => selectTab(0)}
          >
            <ConvertIcon active={selectedTab === 0} />
            <p
              className={`${
                selectedTab === 0 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Stake
            </p>
          </button>
          <div
            data-tooltip-id="coming-soon"
            className={`${
              selectedTab === 1 && 'detail-btn-bg-color-1'
            } flex items-center col-span-6 justify-center py-[13px] m-1 border-button`}
            // onClick={() => selectTab(1)}
          >
            <MoneyIcon active={selectedTab === 1} />
            <p
              className={`${
                selectedTab === 1 ? 'fourth-color' : 'secondary-color'
              } font-tab ml-2`}
            >
              Buy & Stake
            </p>
          </div>
        </div>
        {renderTab()}
        <ReactTooltip
          id="coming-soon"
          place="top"
          render={({ content, activeAnchor }) => (
            <p className="tertiary-color font-13-18-500-hk text-left">
              Coming Soon
            </p>
          )}
          style={{ backgroundColor: '#252747', borderRadius: '12px' }}
        />
      </div>
    </div>
  )
}

export default VeSyneStake
