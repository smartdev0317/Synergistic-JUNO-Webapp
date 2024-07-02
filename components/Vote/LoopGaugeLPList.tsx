import { useState } from 'react'
import { useQueryClient } from 'react-query'
import Image from 'next/image'

import { LOOP_GAUGE } from 'constants/keyNames'
import { DetailedLoopProposal } from 'data/types'
import PercentInput from './PercentInput'

const LoopGaugeLpList = () => {
  const [selectedPool, selectPool] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()
  const proposal: DetailedLoopProposal | undefined = queryClient.getQueryData([LOOP_GAUGE])
  return (
    <div className="overflow-x-auto mt-[34px] mb-[60px]">
      <div className="w-[728px] md:w-full grid grid-cols-11 gap-4 text-left font-th secondary-color mb-[14px] px-[16px] items-center">
        <p className="col-span-1 text-start">FARM</p>
        <p className="col-span-2 text-start">COMPOSITION</p>
        <p className="col-span-2 text-start">TOTAL VOTES</p>
        <p className="col-span-2 text-start">TOTAL VOTE %</p>
        <p className="col-span-2 text-start">TOTAL LOOP ALLOCATED</p>
        <p className="col-span-2 text-end">YOUR VOTE</p>
      </div>
      {
        proposal?.choices.map((choice, index) => (
            <div
              key={"loop-gauge-lp-"+index}
              className={`w-[728px] h-[68px] md:w-full mb-[8px] ${
                selectedPool === choice.pool
                  ? 'second-bg-detail-color'
                  : 'secondary-bg-color-without-hover'
              } border-liquidity grid grid-cols-11 gap-4 md:gap-8 px-[16px] py-[15px]`}
              onClick={() => selectPool(choice.pool)}
            >
              <div className="col-span-1 flex h-full items-center justify-start">
                <Image src={choice.tokens[0].icon} width={27} alt={choice.tokens[0].symbol} />
                <Image src={choice.tokens[1].icon} width={27} alt={choice.tokens[1].symbol} className="ml-[-12px]" />
              </div>
              <div className="col-span-2 flex h-full items-center justify-start">
                <div className="border-button-small px-[5px] vesyne-staking-color mr-[8px]">
                  <p className="font-timer">{choice.tokens[0].symbol}</p>
                </div>
                <div className="border-button-small px-[5px] vesyne-staking-color">
                  <p className="font-timer">{choice.tokens[1].symbol}</p>
                </div>
              </div>
              <div className="col-span-2 flex h-full items-center justify-start">
                <p className="primary-color font-td-3">{choice.votes.power}</p>
              </div>
              <div className="col-span-2 flex h-full items-center justify-start">
                <p className="primary-color font-td-3">{Number(proposal.total_power) > 0 ? (Number(choice.votes.power) * 100 / Number(proposal.total_power)).toFixed(2) : 0}%</p>
              </div>
              <div className="col-span-2 flex h-full items-center justify-start">
                <p className="primary-color font-td-3">0</p>
              </div>
              <div className="col-span-2 h-full">
                <PercentInput
                    type={LOOP_GAUGE}
                    selected={selectedPool}
                    choice={choice}
                />
              </div>
            </div>
        ))
      }
    </div>
  )
}

export default LoopGaugeLpList