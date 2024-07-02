import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import WyndFarmingGauge from './Tab/WyndFarmingGauge'
import ValidatorDelegation from './Tab/ValidatorDelegation'
import LoopFarmingGauge from './Tab/LoopFarmingGauge'

const Voting = ({selectedTab, selectTab}: {selectedTab: number, selectTab: Function}) => {
  const renderDetail = () => {
    switch (selectedTab) {
      case 0:
        return <WyndFarmingGauge />
      case 1:
        return <ValidatorDelegation />
      case 2:
        return <LoopFarmingGauge />
    }
  }
  return (
    <div>
      <div className="overflow-x-auto pb-[10px]">
        <div className="w-[440px] xs:w-full flex justify-center items-center mt-[110px] md:gap-[25px] gap-[15px]">
          <button
            className={`${
              selectedTab === 0
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectTab(0)}
          >
            WYND Farming Gauges
          </button>
          <button
            data-tooltip-id="coming-soon"
            className={`${
              selectedTab === 1
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            // onClick={() => selectTab(1)}
          >
            Validator Delegations
          </button>
          <button
            className={`${
              selectedTab === 2
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectTab(2)}
          >
            LOOP Farming Gauges
          </button>
        </div>
        <div className="w-full h-[1px] split-gradient mt-[12px]" />
      </div>
      {renderDetail()}
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
  )
}

export default Voting
