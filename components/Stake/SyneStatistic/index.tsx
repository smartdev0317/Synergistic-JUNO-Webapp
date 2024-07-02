import { useQueryClient } from 'react-query'

import TokenImg from 'components/TokenImg'
import veSyne from 'components/images/png/vesyne.png'
import syne from 'components/images/png/syne.png'
import wynd from 'components/images/png/wynd.png'
import lopo from 'components/images/png/lopo.png'
import {
  LOOP,
  SYNE,
  SYNE_STAKING_REWARD,
  TOKEN_BALANCE,
  TOTAL_BALANCE,
  VESYNE,
  VOTING_POWER,
  WYND,
} from 'constants/keyNames'
import { SyneBalanceData, SyneStakingRewardData } from 'data/types'
import bigDecimal from 'js-big-decimal'
import { getReadableBalance } from 'data/utils'
import { useWallet } from '@noahsaso/cosmodal'

const SyneStatistic = () => {
  const queryClient = useQueryClient()
  const { address: walletAddress } = useWallet()

  const veSyneBalanceData: any = queryClient.getQueryData([
    TOKEN_BALANCE,
    VESYNE,
    walletAddress,
  ])
  const veSyneTotalBalance: any = queryClient.getQueryData([
    TOTAL_BALANCE,
    VESYNE
  ])
  const wyndVotingPower: string | undefined = queryClient.getQueryData([
    VOTING_POWER,
    WYND
  ])
  const loopVotingPower: string | undefined = queryClient.getQueryData([
    VOTING_POWER,
    LOOP
  ])
  
  const userWyndVotingPower = walletAddress && Number(veSyneTotalBalance?.balance || "0") > 0 ? getReadableBalance((Number(wyndVotingPower || "0") * Number(veSyneBalanceData?.balance || "0") / Number(veSyneTotalBalance?.balance || "0")).toString(), 0, 2) : "0.00"
  const userLoopVotingPower = walletAddress && Number(veSyneTotalBalance?.balance || "0") > 0 ? getReadableBalance((Number(loopVotingPower || "0") * Number(veSyneBalanceData?.balance || "0") / Number(veSyneTotalBalance?.balance || "0")).toString(), 0, 2) : "0.00"
  const syneStakingRewardData: SyneStakingRewardData | undefined =
    queryClient.getQueryData([SYNE_STAKING_REWARD, walletAddress])

  const syneStakingReward = syneStakingRewardData
    ? syneStakingRewardData.rewards.reduce(
        (accumulator, currentValue) =>
          new bigDecimal(currentValue.reward)
            .add(new bigDecimal(accumulator))
            .getValue(),
        '0'
      )
    : '0'

  const veSyneBalance = veSyneBalanceData?.balance || '0'

  return (
    <div className="overflow-x-auto">
      <div className=" third-bg-color rounded-[12px] px-[32px] py-[20px] flex w-[786px] lg:w-full">
        <div className="flex-1 flex flex-col items-start justify-start">
          <TokenImg icon={veSyne} iconAlt="veSYNE" size="md" />
          <p className="mt-[12px] tertiary-color font-12-18-400-hk text-start">
            My veSYNE
          </p>
          <p className="white font-18-28-600-ipm">
            {getReadableBalance(
              veSyneBalance,
              veSyneBalanceData?.decimals || 6,
              2
            )}
          </p>
        </div>
        <span className="split-border" />
        <div className="flex-1 flex flex-col items-start justify-start px-[10px] sm:px-[20px] lg:pl-[50px]">
          <TokenImg icon={syne} iconAlt="SYNE" size="md" />
          <p className="mt-[12px] tertiary-color font-12-18-400-hk text-start">
            My Rewards
          </p>
          <p className="white font-18-28-600-ipm">
            {getReadableBalance(
              syneStakingReward,
              syneStakingRewardData?.decimals || 6,
              2
            )}
          </p>
        </div>
        <span className="split-border" />
        <div className="flex-1 flex flex-col items-start justify-start px-[10px] sm:px-[20px] lg:pl-[50px]">
          <TokenImg icon={wynd} iconAlt="WYND" size="md" />
          <p className="mt-[12px] tertiary-color font-12-18-400-hk text-start">
            My WYND Voting Power
          </p>
          <p className="white font-18-28-600-ipm">{userWyndVotingPower}</p>
        </div>
        <span className="split-border" />
        <div className="flex-1 flex flex-col items-start justify-start px-[10px] sm:px-[20px] lg:pl-[50px]">
          <TokenImg icon={lopo} iconAlt="LOPO" size="md" />
          <p className="mt-[12px] tertiary-color font-12-18-400-hk text-start">
            My LOOP Voting Power
          </p>
          <p className="white font-18-28-600-ipm">{userLoopVotingPower}</p>
        </div>
      </div>
    </div>
  )
}

export default SyneStatistic
