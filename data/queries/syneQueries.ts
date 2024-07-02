import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useWallet } from '@noahsaso/cosmodal'
import { LOOP_PROTOCOL_STAKING, SYNERGISTIC_LOOP_STAKER, SYNERGISTIC_WYND_STAKER, SYNE_STAKING_CONTRACT, WYND_STAKING_MODULE } from 'constants/address'
import {
  LAST_DISTRIBUTION_TIME,
  LOOP,
  SYNE,
  SYNE_STAKING,
  SYNE_STAKING_REWARD,
  TOKEN_BALANCE,
  TOTAL_BALANCE,
  TOTAL_DAILY_REWARD,
  VESYNE,
  VOTING_POWER,
  WYND,
} from 'constants/keyNames'
import { LOOP_STAKING_PERIODS, PUBLIC_RPC_ENDPOINT, STAKING_PERIODS } from 'constants/setting'
import { defaultTokenLists } from 'constants/tokenLists'
import bigDecimal from 'js-big-decimal'
import { useQuery, useQueryClient } from 'react-query'

export const useFetchSyneData = () => {
  useFetchSyneBalance()
  useFetchVeSyneBalance()
  useFetchSyneStakingReward()
  useFetchLastDistributionTime()
  useFetchTotalDailyReward()
  useFetchVeSyneTotalBalance()
  useFetchWyndVotingPower()
  useFetchLoopVotingPower()
}

export const useFetchGaugeData = () => {
  useFetchVeSyneBalance()
  useFetchVeSyneTotalBalance()
}

const useFetchSyneBalance = () => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [TOKEN_BALANCE, SYNE, walletAddress],
    queryFn: async () => {
      const syneToken = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syneToken === undefined) return 0
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const balanceResponse = await cosmwasmClient.queryContractSmart(
        syneToken.address,
        { balance: { address: walletAddress } }
      )
      const vestingResponse = await cosmwasmClient.queryContractSmart(
        syneToken.address,
        { vesting: { address: walletAddress } }
      )
      return {
        balance: balanceResponse.balance,
        locked: vestingResponse.locked,
        decimals: syneToken.decimals,
      }
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}
const useFetchVeSyneBalance = () => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [TOKEN_BALANCE, VESYNE, walletAddress],
    queryFn: async () => {
      const veSyneToken = defaultTokenLists.find(
        (each) => each.symbol === VESYNE
      )
      if (veSyneToken === undefined) return 0
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const balanceResponse = await cosmwasmClient.queryContractSmart(
        veSyneToken.address,
        { balance: { address: walletAddress } }
      )
      return {
        balance: balanceResponse.balance,
        decimals: veSyneToken.decimals,
      }
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchVeSyneTotalBalance = () => {
  const { data, error } = useQuery({
    queryKey: [TOTAL_BALANCE, VESYNE],
    queryFn: async () => {
      const veSyneToken = defaultTokenLists.find(
        (each) => each.symbol === VESYNE
      )
      if (veSyneToken === undefined) return undefined
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let totalBalance = '0'
      for (let i of Object.values(STAKING_PERIODS)) {
        const balanceResponse = await cosmwasmClient.queryContractSmart(
          veSyneToken.address,
          { total_balance: { duration: i } }
        )
        totalBalance = new bigDecimal(totalBalance)
          .add(new bigDecimal(balanceResponse?.balance || '0'))
          .getValue()
      }
      return {
        balance: totalBalance,
        decimals: veSyneToken.decimals,
      }
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndVotingPower = () => {
  const { data, error } = useQuery({
    queryKey: [VOTING_POWER, WYND],
    queryFn: async () => {
      const wyndToken = defaultTokenLists.find(
        (each) => each.symbol === WYND
      )
      if (wyndToken === undefined) return undefined
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const powerResponse = await cosmwasmClient.queryContractSmart(
        WYND_STAKING_MODULE,
        { voting_power_at_height: { address: SYNERGISTIC_WYND_STAKER } }
      )
      return powerResponse?.power || "0"
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}
const useFetchLoopVotingPower = () => {
  const { data, error } = useQuery({
    queryKey: [VOTING_POWER, LOOP],
    queryFn: async () => {
      const loopToken = defaultTokenLists.find(
        (each) => each.symbol === LOOP
      )
      if (loopToken === undefined) return undefined
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let power = '0'
      for (let i of Object.values(LOOP_STAKING_PERIODS)) {
        const balanceResponse = await cosmwasmClient.queryContractSmart(
          LOOP_PROTOCOL_STAKING,
          { balance_by_duration: { address: SYNERGISTIC_LOOP_STAKER, duration: i } }
        )
        power = new bigDecimal(power)
          .add(new bigDecimal(balanceResponse || '0'))
          .divide(new bigDecimal(Math.pow(10, 6)), power.length)
          .getValue()
      }
      return power
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchSyneStakingReward = () => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [SYNE_STAKING_REWARD, walletAddress],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let stakingRewards = []
      const syneToken = defaultTokenLists.find((each) => each.symbol === SYNE)
      for (let period of Object.values(STAKING_PERIODS)) {
        try {
          const rewardResponse = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            { query_user_reward: { wallet: walletAddress, duration: period } }
          )
          stakingRewards.push({
            reward: new bigDecimal(rewardResponse.user_reward)
              .add(new bigDecimal(rewardResponse.pending_reward))
              .getValue(),
            duration: period,
          })
        } catch (e) {
          continue
        }
      }
      return {
        rewards: stakingRewards,
        decimals: syneToken?.decimals || 6,
      }
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useFetchLastDistributionTime = () => {
  const { data, error } = useQuery({
    queryKey: [SYNE_STAKING, LAST_DISTRIBUTION_TIME],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lastDistributionTimeResponse =
        await cosmwasmClient.queryContractSmart(SYNE_STAKING_CONTRACT, {
          query_last_distribution_time: {},
        })
      return lastDistributionTimeResponse
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useFetchTotalDailyReward = () => {
  const { data, error } = useQuery({
    queryKey: [SYNE_STAKING, TOTAL_DAILY_REWARD],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const totalDailyRewardResponse = await cosmwasmClient.queryContractSmart(
        SYNE_STAKING_CONTRACT,
        {
          query_total_daily_reward: {},
        }
      )
      return totalDailyRewardResponse
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useFetchUserSyneStaking = () => {
  const { address: walletAddress } = useWallet()
  const queryClient = useQueryClient()
  const totalBalance: any = queryClient.getQueryData([TOTAL_BALANCE, VESYNE])
  const lastDistributionTime = queryClient.getQueryData([
    SYNE_STAKING,
    LAST_DISTRIBUTION_TIME,
  ])
  const totalDailyReward = queryClient.getQueryData([
    SYNE_STAKING,
    TOTAL_DAILY_REWARD,
  ])
  const { data, error } = useQuery({
    queryKey: [SYNE_STAKING, walletAddress],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const syneToken = defaultTokenLists.find((each) => each.symbol === SYNE)
      const veSyneToken = defaultTokenLists.find(
        (each) => each.symbol === VESYNE
      )
      if (veSyneToken === undefined) return undefined
      let userStaked = []
      for (let period of Object.values(STAKING_PERIODS)) {
        try {
          const stakedResponse = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            {
              query_staked_by_user: { wallet: walletAddress, duration: period },
            }
          )
          const totalStakedByDuration = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            {
              query_total_staked_by_duration: { duration: period },
            }
          )
          const veSyneBalanceResponse = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            {
              balance_by_duration: { address: walletAddress, duration: period },
            }
          )
          const veSyneTotalBalanceByDuration =
            await cosmwasmClient.queryContractSmart(veSyneToken.address, {
              total_balance: { duration: period },
            })
          const stakedTimeResponse = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            {
              query_user_staked_time: {
                wallet: walletAddress,
                duration: period,
              },
            }
          )
          const rewardResponse = await cosmwasmClient.queryContractSmart(
            SYNE_STAKING_CONTRACT,
            { query_user_reward: { wallet: walletAddress, duration: period } }
          )
          const apr =
            `${((Number(totalDailyReward) *
              Number(veSyneTotalBalanceByDuration.balance)) /
            Number(totalBalance.balance) /
            Number(totalStakedByDuration)
            * 365 * 100).toFixed(2)}%`
          if (Number(stakedResponse) > 0) {
            userStaked.push({
              period,
              amount: stakedResponse,
              decimals: syneToken?.decimals,
              vesyne: veSyneBalanceResponse,
              vesyne_max: stakedResponse * period,
              stakedAt: stakedTimeResponse,
              totalVesyneBalance: totalBalance,
              lastDistributionTime,
              reward: rewardResponse,
              totalDailyReward,
              apr,
            })
          }
        } catch (e) {
          continue
        }
      }
      return userStaked
    },
    enabled: !!walletAddress && !!totalBalance && !!lastDistributionTime,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}
