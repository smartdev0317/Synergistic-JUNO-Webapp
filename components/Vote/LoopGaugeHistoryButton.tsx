import { LOOP } from 'constants/keyNames'
import { useMemo } from 'react'

const LoopGaugeHistoryButton = ({
  year,
  month,
  date,
  history,
  onClick,
}: {
  year: number
  month: number
  date: number
  history: any
  onClick: Function
}) => {
  const proposal = useMemo(() => {
    for (let page of history?.pages || []) {
      for (let each of page) {
        let startTime = new Date(year, month, date).getTime() / 1000
        if (each.info.time >= startTime && each.info.time < startTime + 86400) {
          return each
        }
      }
    }
    return undefined
  }, [year, month, date, history])
  return (
    <button
      className="history-select-button rounded-[12px] w-[40px] h-[40px] month-selector-border flex items-center justify-center font-13-17-700-hk"
      disabled={proposal === undefined}
      onClick={() => onClick()}
    >
      {date}
    </button>
  )
}

export default LoopGaugeHistoryButton
