import { useMemo } from 'react'
import Image from 'next/image'
import { Modal } from 'rsuite'

import { getReducedBalance } from 'data/utils'
import { loopGaugeLpList } from 'constants/loopGauge'
import bigDecimal from 'js-big-decimal'

const LoopGaugeHistoryModal = ({
  open,
  handleClose,
  year,
  month,
  date,
  history,
}: {
  open: boolean
  handleClose: Function
  year: number
  month: number
  date: number
  history: any
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
  const proposalDetail = useMemo(() => {
    if (proposal === undefined) return undefined
    let proposalDetail: any = JSON.parse(JSON.stringify(proposal.info))
    let choices = proposalDetail.choices
    let total_power = new bigDecimal(proposal?.info.total_power || '0')
      .divide(new bigDecimal('1000000'), 2)
      .getValue()
    let detailedChoices = choices.map((choice: any) => {
      let choiceDetail = loopGaugeLpList.find(
        (lp) => lp.address === choice.pool
      )
      let votes = choice.votes
      votes.power = new bigDecimal(votes.power)
        .divide(new bigDecimal('1000000'), 2)
        .getValue()
      return {
        pool: choice.pool,
        votes: votes,
        tokens: choiceDetail?.tokens,
      }
    })
    proposalDetail.choices = detailedChoices
    proposalDetail.total_power = total_power
    return proposalDetail
  }, [proposal])
  let start_date = new Date(proposal?.info?.voting_start_time * 1000)
  let end_date = new Date(proposal?.info?.expiration?.at_time / 1000000)
  return (
    <Modal overflow={true} open={open} onClose={() => handleClose()}>
      <Modal.Header>
        <p className="font-24-30-700-hk">Voting History</p>
        <p className="font-16-24-500-hk tertiary-color mt-[8px]">
          {/* June 1 - June 7 2023 · 2.34m votes · Voted */}
          {`${start_date.toLocaleString('en-US', {
            month: 'long',
          })} ${start_date.getDate()} - ${end_date.toLocaleString('en-US', {
            month: 'long',
          })} ${end_date.getDate()} ${start_date.getFullYear()} · ${getReducedBalance(
            proposal?.info?.total_power,
            6,
            2
          )} votes · Voted`}
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="overflow-x-auto">
          <div className="w-[768px] md:w-full grid grid-cols-11 gap-4 text-left font-th secondary-color mb-[14px] px-[16px] items-center">
            <p className="col-span-1 text-start">FARM</p>
            <p className="col-span-2 text-start">COMPOSITION</p>
            <p className="col-span-2 text-start">TOTAL VALUES</p>
            <p className="col-span-2 text-start">TOTAL VOTE %</p>
            <p className="col-span-2 text-start">TOTAL LOOP ALLOCATED</p>
            <p className="col-span-2 text-end">YOUR VOTE</p>
          </div>
          {proposalDetail?.choices.map((choice: any, index: number) => (
            <div
              key={'loop-gauge-lp-' + index}
              className={`w-[728px] h-[68px] md:w-full secondary-bg-color-without-hover border-liquidity grid grid-cols-11 gap-4 md:gap-8 px-[16px] py-[15px]`}
            >
              <div className="col-span-1 flex h-full items-center justify-start">
                <Image
                  src={choice.tokens[0].icon}
                  width={27}
                  alt={choice.tokens[0].symbol}
                />
                <Image
                  src={choice.tokens[1].icon}
                  width={27}
                  alt={choice.tokens[1].symbol}
                  className="ml-[-12px]"
                />
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
                <p className="primary-color font-td-3">
                  {Number(proposalDetail.total_power) > 0
                    ? (
                        (Number(choice.votes.power) * 100) /
                        Number(proposalDetail.total_power)
                      ).toFixed(2)
                    : 0}
                  %
                </p>
              </div>
              <div className="col-span-2 flex h-full items-center justify-start">
                <p className="primary-color font-td-3">0</p>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}

export default LoopGaugeHistoryModal
