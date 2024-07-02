import { useState, useEffect } from 'react'
import { useQueryClient } from 'react-query'

import LoopGaugeHistoryModal from './LoopGaugeHistoryModal'
import {
  useSynergisticLoopGaugeProposalHistory,
} from 'data/queries/synergisticGaugeQueries'
import {
  LOOP,
  LOOP_GAUGE,
  PROPOSAL_HISTORY,
} from 'constants/keyNames'
import LoopGaugeHistoryButton from './LoopGaugeHistoryButton'

const LoopGaugeHistory = () => {
  const queryClient = useQueryClient()
  const [selectedMonth, selectMonth] = useState(new Date().getMonth())
  const [selectedDate, selectDate] = useState(0)
  const { hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useSynergisticLoopGaugeProposalHistory()
  const proposalHistory = queryClient.getQueryData([
    LOOP_GAUGE,
    PROPOSAL_HISTORY,
  ])

  useEffect(() => {
    if (hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage])

  let dates = 30
  switch (selectedMonth) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      dates = 31
      break
    case 1:
      let year = new Date().getFullYear()
      if (year % 4 === 0 && year % 400 !== 0) dates = 29
      else dates = 28
      break
  }
  return (
    <div className="mt-[123px] mb-[60px]">
      <div className="overflow-x-auto pb-[10px]">
        <div className="flex justify-between items-center gap-[15px]">
          <button
            className={`${
              selectedMonth === 0
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(0)}
          >
            January
          </button>
          <button
            className={`${
              selectedMonth === 1
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(1)}
          >
            February
          </button>
          <button
            className={`${
              selectedMonth === 2
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(2)}
          >
            March
          </button>
          <button
            className={`${
              selectedMonth === 3
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(3)}
          >
            April
          </button>
          <button
            className={`${
              selectedMonth === 4
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(4)}
          >
            May
          </button>
          <button
            className={`${
              selectedMonth === 5
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(5)}
          >
            June
          </button>
          <button
            className={`${
              selectedMonth === 6
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(6)}
          >
            July
          </button>
          <button
            className={`${
              selectedMonth === 7
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(7)}
          >
            August
          </button>
          <button
            className={`${
              selectedMonth === 8
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(8)}
          >
            September
          </button>
          <button
            className={`${
              selectedMonth === 9
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(9)}
          >
            October
          </button>
          <button
            className={`${
              selectedMonth === 10
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(10)}
          >
            November
          </button>
          <button
            className={`${
              selectedMonth === 11
                ? 'fourth-color relative tab-active'
                : 'tertiary-color'
            } font-16-24-700-hk`}
            onClick={() => selectMonth(11)}
          >
            December
          </button>
        </div>
        <div className="w-full h-[1px] split-gradient mt-[12px]" />
      </div>
      <div className="flex flex-wrap justify-start gap-[11px] mt-[20px]">
        {Array.from({ length: dates }, (_, i) => i + 1).map((each) => (
          <LoopGaugeHistoryButton
            key={`${selectedMonth}-${each}`}
            year={new Date().getFullYear()}
            month={selectedMonth}
            date={each}
            onClick={() => selectDate(each)}
            history={proposalHistory}
          />
        ))}
      </div>
      <LoopGaugeHistoryModal
        open={selectedDate > 0}
        handleClose={() => selectDate(0)}
        year={new Date().getFullYear()}
        month={selectedMonth}
        date={selectedDate}
        history={proposalHistory}
      />
    </div>
  )
}

export default LoopGaugeHistory
