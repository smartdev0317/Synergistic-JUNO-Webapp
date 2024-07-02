import { useRef, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import {
  DetailedListOption,
  DetailedLoopGaugeChoice,
  LoopMultipleChoiceVote,
  WyndMultipleChoiceVote,
} from 'data/types'
import {
  loopGaugeVoteNow,
  loopGaugeVotes,
  wyndGaugeVoteNow,
  wyndGaugeVotes,
} from 'data/atom'
import { LOOP_GAUGE, WYND_GAUGE } from 'constants/keyNames'

const PercentInput = ({
  type,
  selected,
  choice,
}: {
  type: string
  selected: string | undefined
  choice: DetailedLoopGaugeChoice | DetailedListOption
}) => {
  const [loopVoteNow, setLoopVoteNow] = useRecoilState(loopGaugeVoteNow)
  const [loopVotes, setLoopVotes] = useRecoilState(loopGaugeVotes)
  const [wyndVoteNow, setWyndVoteNow] = useRecoilState(wyndGaugeVoteNow)
  const [wyndVotes, setWyndVotes] = useRecoilState(wyndGaugeVotes)
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (choice.pool === selected) {
      if (inputElement.current) {
        inputElement.current.focus()
      }
    }
  }, [selected, choice.pool])
  // set votes list
  let newVotes =
    type === LOOP_GAUGE
      ? JSON.parse(JSON.stringify(loopVotes))
      : JSON.parse(JSON.stringify(wyndVotes))
  let index = type === LOOP_GAUGE
      ? newVotes.findIndex(
          (each: LoopMultipleChoiceVote) => each.pool === choice.pool
        )
      : newVotes.findIndex(
        (each: WyndMultipleChoiceVote) => each.option === choice.pool
      )
  let value = index === -1 ? 0 : type === LOOP_GAUGE ? newVotes[index].percentage : Number(newVotes[index].weight) * 100
  const onChange = (_value: string) => {
    let newValue = Math.floor(Number(_value))
    switch (type) {
      case LOOP_GAUGE:
        if (loopVoteNow + newValue - value <= 100) {
          setLoopVoteNow(loopVoteNow + newValue - value)
          if (index === -1) {
            newVotes.push({
              pool: choice.pool,
              percentage: newValue,
            })
          } else {
            newVotes[index].percentage = newValue
          }
          setLoopVotes(newVotes)
        }
        break
      case WYND_GAUGE:
        if (wyndVoteNow + newValue - value <= 100) {
          setWyndVoteNow(wyndVoteNow + newValue - value)
          if (index === -1) {
            newVotes.push({
              option: choice.pool,
              weight: (newValue / 100).toString(),
            })
          } else {
            newVotes[index].weight = (newValue / 100).toString()
          }
          setWyndVotes(newVotes)
        }
        break
    }
  }
  const setMax = () => {
    switch (type) {
      case LOOP_GAUGE:
        setLoopVoteNow(100)
        if (index === -1) {
          newVotes.push({
            pool: choice.pool,
            percentage: 100 - loopVoteNow + value,
          })
        } else {
          newVotes[index].percentage = 100 - loopVoteNow + value
        }
        setLoopVotes(newVotes)
        break
      case WYND_GAUGE:
        setWyndVoteNow(100)
        if (index === -1) {
          newVotes.push({
            option: choice.pool,
            weight: ((100 - wyndVoteNow + value) / 100).toString(),
          })
        } else {
          newVotes[index].percentage = ((100 - wyndVoteNow + value) / 100).toString()
        }
        setWyndVotes(newVotes)
        break
    }
  }
  return (
    <div className="relative">
      <div
        className={`${
          selected === choice.pool ? 'hidden' : ''
        } flex justify-end h-full items-center`}
      >
        <p className="font-15-22-600-ipm badge-color-1">{value}%</p>
      </div>
      <div className={`${selected === choice.pool ? '' : 'hidden'}`}>
        <input
          ref={inputElement}
          className="w-full detail-bg-color-1 input-border outline-0 font-td-3 h-[38px] pl-[10px] lg:pl-[17px] pr-[50px] lg:pr-[71px] badge-color-1"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="font-td-3 badge-color-1 absolute top-[9px] right-[57px] lg:right-[80px]">
          %
        </p>
        <button
          className="detail-btn-bg-color-2 border-button-small font-td-8 px-[9px] py-[4px] absolute top-[7px] right-[10px] lg:right-[15px]"
          onClick={() => setMax()}
        >
          MAX
        </button>
      </div>
    </div>
  )
}

export default PercentInput
