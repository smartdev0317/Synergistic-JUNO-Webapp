import Image from 'next/image'
import { useQueryClient } from 'react-query'
import { useWallet } from '@noahsaso/cosmodal'

import TokenImg from 'components/TokenImg'
import vesyne from 'components/images/png/vesyne.png'
import clock from 'components/images/png/clock.png'
import vector from 'components/images/png/vector.png'
import lopo from 'components/images/png/lopo.png'
import wynd from 'components/images/png/wynd.png'
import percent from 'components/images/png/percent.png'
import cryptocurrency from 'components/images/png/cryptocurrency.png'
import {
  LOOP_GAUGE,
  PROPOSAL_VERSION,
  TOKEN_BALANCE,
  TOTAL_BALANCE,
  VESYNE,
  WYND_GAUGE,
} from 'constants/keyNames'
import { getReducedBalance } from 'data/utils'
import {
  DetailedLoopProposal,
  WyndGaugeDetail,
  WyndGaugeVersion,
} from 'data/types'

const VeSyneStaticstic = ({ selectedTab }: { selectedTab: number }) => {
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()

  const loop_proposal: DetailedLoopProposal | undefined =
    queryClient.getQueryData([LOOP_GAUGE])

  const wynd_proposal: WyndGaugeDetail | undefined = queryClient.getQueryData([
    WYND_GAUGE,
  ])

  const loopProposalVersion: any = queryClient.getQueryData([
    LOOP_GAUGE,
    PROPOSAL_VERSION,
  ])

  const wyndProposalVersion: WyndGaugeVersion | undefined =
    queryClient.getQueryData([WYND_GAUGE, PROPOSAL_VERSION])

  const veSyneBalanceData: any = queryClient.getQueryData([
    TOKEN_BALANCE,
    VESYNE,
    walletAddress,
  ])

  const veSyneTotalBalanceData: any = queryClient.getQueryData([
    TOTAL_BALANCE,
    VESYNE,
  ])

  const veSyneBalance = veSyneBalanceData?.balance || '0'
  const veSyneTotalBalance = veSyneTotalBalanceData?.balance || '0'
  const votingPowerPercentage = (
    (Number(veSyneBalance) / Number(veSyneTotalBalance)) *
    100
  )
    .toFixed(2)
    .concat('%')
  let deltaTime = 0
  let version = "0"
  switch (selectedTab) {
    case 0:
      deltaTime = Math.max(
        Math.floor(
          (Number(wynd_proposal?.wyndGauge.next_epoch) ||
            0 )- (Number(wynd_proposal?.wyndGauge.epoch_pending_size) ||
            0) - Date.now() / 1000
        ),
        0
      )
      version = wyndProposalVersion?.version || "0"
      break
    case 2:
      deltaTime = Math.max(
        Math.floor(
          (Number(loop_proposal?.expiration.at_time) / 1000000000 || 0) -
            (Number(loop_proposal?.pending_period.time) || 0) -
            Date.now() / 1000
        ),
        0
      )
      version = loopProposalVersion?.version || "0"
      break
  }

  const days = Math.floor(deltaTime / 86400)
  const hours = Math.floor((deltaTime % 86400) / 3600)
  const minutes = Math.floor((deltaTime % 3600) / 60)

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-11 gap-[16px] overflow-x-auto w-[600px] sm:w-full">
        <div className="col-span-3 hidden lg:flex flex-col gap-[16px]">
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={vesyne} iconAlt="veSYNE" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">My veSYNE</p>
              <p className="font-18-28-600-ipm primary-color">{`${getReducedBalance(
                veSyneBalance,
                veSyneBalanceData?.decimals || 6,
                2
              )}/ ${getReducedBalance(
                veSyneTotalBalance,
                veSyneTotalBalanceData?.decimals || 6,
                2
              )}`}</p>
            </div>
          </div>
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={clock} iconAlt="Clock" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">Next Epoch</p>
              {days > 0 ? (
                <p className="primary-color">
                  <span className="font-18-28-700-hk">{days}</span>
                  <span className="font-18-28-600-ipm">days</span>
                  <span className="font-18-28-700-hk"> {hours}</span>
                  <span className="font-18-28-600-ipm">hours</span>
                </p>
              ) : (
                <p className="primary-color">
                  <span className="font-18-28-700-hk">{hours}</span>
                  <span className="font-18-28-600-ipm">hours</span>
                  <span className="font-18-28-700-hk"> {minutes}</span>
                  <span className="font-18-28-600-ipm">minutes</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 h-[238px] lg:col-span-5 flex flex-col items-center justify-around balance-bg-color border-12">
          <div className="flex justify-center items-end gap-[13px]">
            <div className="flex justify-center items-center gap-[8px]">
              <TokenImg icon={vesyne} iconAlt="veSYNE" size="big" />
              <p className="font-18-28-500-hk">
                <span className="font-24-28-700-hk">1</span> veSYNE
              </p>
            </div>
            <p>&asymp; {/* $1.23 */}TBD</p>
          </div>
          <div className="w-full h-0 border-[1.5px] border-dashed border-split-color relative">
            <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-[16px] py-[8px] vector-bg-color rounded-[40px]">
              <Image src={vector} width={11} height={14} alt="Vector" />
            </p>
          </div>
          <div className="flex justify-center items-end gap-[8px]">
            <div className="flex justify-center items-center gap-[25px]">
              <div className="flex items-center">
                <Image src={lopo} width={26} height={26} alt="LOPO" />
                <Image
                  src={wynd}
                  width={21}
                  height={21}
                  alt="WYND"
                  className="mx-[-12px]"
                />
              </div>
              <p className="font-18-28-500-hk">
                <span className="font-24-28-700-hk">{/* 2.46 */}TBD</span>{' '}
                voting power/year
              </p>
            </div>
            <p className="badge-color-1 px-[5px] badge-bg-color rounded-[4px] font-12-18-500-hk">
              2X BOOST
            </p>
          </div>
        </div>
        <div className="col-span-6 lg:hidden flex flex-col gap-[16px]">
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={vesyne} iconAlt="veSYNE" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">My veSYNE</p>
              <p className="font-18-28-600-ipm primary-color">{`${getReducedBalance(
                veSyneBalance,
                veSyneBalanceData?.decimals || 6,
                2
              )}/ ${getReducedBalance(
                veSyneTotalBalance,
                veSyneTotalBalanceData?.decimals || 6,
                2
              )}`}</p>
            </div>
          </div>
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={clock} iconAlt="Clock" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">Next Epoch</p>
              {days > 0 ? (
                <p className="primary-color">
                  <span className="font-18-28-700-hk">{days}</span>
                  <span className="font-18-28-600-ipm">days</span>
                  <span className="font-18-28-700-hk"> {hours}</span>
                  <span className="font-18-28-600-ipm">hours</span>
                </p>
              ) : (
                <p className="primary-color">
                  <span className="font-18-28-700-hk">{hours}</span>
                  <span className="font-18-28-600-ipm">hours</span>
                  <span className="font-18-28-700-hk"> {minutes}</span>
                  <span className="font-18-28-600-ipm">minutes</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-6 lg:col-span-3 flex flex-col gap-[16px]">
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={percent} iconAlt="Percent" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">
                Percentage of voting power
              </p>
              <p className="font-18-28-600-ipm primary-color">
                {votingPowerPercentage}
              </p>
            </div>
          </div>
          <div className="statistic-bg-color border-12 w-full px-[25px] py-[32px] flex items-center justify-left gap-[25px]">
            <TokenImg icon={cryptocurrency} iconAlt="Crypto" size="small" />
            <div className="flex flex-col items-start gap-[1px]">
              <p className="font-12-18-400-hk tertiary-color">Current Epoch</p>
              <p className="font-18-28-600-ipm primary-color">
                #{version}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VeSyneStaticstic
