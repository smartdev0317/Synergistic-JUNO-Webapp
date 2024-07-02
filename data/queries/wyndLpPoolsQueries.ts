import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Block } from '@cosmjs/stargate'
import { useWallet } from '@noahsaso/cosmodal'
import bigDecimal from 'js-big-decimal'
import { useQuery, useQueryClient } from 'react-query'

import {
  LOOP_PROTOCOL_FARMING_CONTRACT,
  LOOP_STACKING_ADDR,
  WYNDEX_FARMING_CONTRACT,
  WYND_STACKING_ADDR,
} from 'constants/address'
import {
  APR,
  LOOP,
  LP_POOLS,
  TOKEN_BALANCE,
  TOKEN_PRICES,
  TVL,
  VAULT_USER_CLAIM,
  VAULT_USER_DEPOSIT,
  VAULT_USER_REWARD,
  WYND,
} from 'constants/keyNames'
import { wyndLpPools } from 'constants/lpPools'
import { PUBLIC_RPC_ENDPOINT } from 'constants/setting'
import {
  DistributableToken,
  WyndLpFarmDataType,
  PoolInfo,
  TokenBalanceResponse,
  TokenPrice,
  UserReward,
  UserRewardInfo,
  WyndUserStakedByDurationResponse,
  WyndTotalStakedByPairResponse,
  WyndUserRewardInfoResponse,
  WyndPoolInfo,
  ClaimsResponse,
} from 'data/types'
import { UNBONDING_PERIOD } from 'constants/wyndGauge'

export const useFetchWyndLpPool = (pool: WyndLpFarmDataType) => {
  useFetchWyndLpPoolApr(pool.base, pool.pair)
  useFetchWyndUserLpDeposit(pool.base, pool.pair)
  useFetchWyndLpTvl(pool.base, pool.pair)
  useFetchWyndUserLpReward(pool.base, pool.pair)
  useFetchWyndUserLpBalance(pool.base, pool.lpAddr)
  useFetchWyndUserLpClaim(pool.base, pool.pair)
}

const useFetchWyndLpPoolApr = (base: string, pair: string) => {
  const queryClient = useQueryClient()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, pair, APR],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.pair === pair)
      if (lpDetail === undefined) return '0'
      // get lp token price
      const poolInfo: WyndPoolInfo = await cosmwasmClient.queryContractSmart(
        pair,
        {
          pool: {},
        }
      )
      const tokenPrices: TokenPrice[] | undefined =
        queryClient.getQueryData(TOKEN_PRICES)
      if (tokenPrices === undefined) return '0'
      const poolInfoAsset0 =
        'token' in poolInfo.assets[0].info
          ? poolInfo.assets[0].info.token
          : poolInfo.assets[0].info.native
      const poolInfoAsset1 =
        'token' in poolInfo.assets[1].info
          ? poolInfo.assets[1].info.token
          : poolInfo.assets[1].info.native
      const token0Price = Number(
        tokenPrices &&
          tokenPrices.find((each) => {
            return each.token === poolInfoAsset0
          })?.unitPrice
      )
      const token1Price = Number(
        tokenPrices &&
          tokenPrices.find((each) => {
            return each.token === poolInfoAsset1
          })?.unitPrice
      )
      let checkOrder = true
      let asset0Addr =
        'addr' in lpDetail.asset0 ? lpDetail.asset0.addr : lpDetail.asset0.denom
      let asset1Addr =
        'addr' in lpDetail.asset1 ? lpDetail.asset1.addr : lpDetail.asset1.denom
      if (asset0Addr === poolInfoAsset0 && asset1Addr === poolInfoAsset1)
        checkOrder = true
      else if (asset0Addr === poolInfoAsset1 && asset1Addr === poolInfoAsset0)
        checkOrder = false
      else {
        console.error('Invalid LP tokens', poolInfo, lpDetail)
        return '0'
      }
      let lpPrice = 0
      if (checkOrder === true) {
        lpPrice =
          ((Number(poolInfo.assets[0].amount) /
            Math.pow(10, lpDetail.asset0.decimals)) *
            token0Price +
            (Number(poolInfo.assets[1].amount) /
              Math.pow(10, lpDetail.asset1.decimals)) *
              token1Price) /
          (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
      } else {
        lpPrice =
          ((Number(poolInfo.assets[0].amount) /
            Math.pow(10, lpDetail.asset1.decimals)) *
            token0Price +
            (Number(poolInfo.assets[1].amount) /
              Math.pow(10, lpDetail.asset0.decimals)) *
              token1Price) /
          (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
      }
        // get total staked lp
        let totalStakedLpResponse: String =
          await cosmwasmClient.queryContractSmart(WYNDEX_FARMING_CONTRACT, {
            query_total_staked: { staked_token: lpDetail.lpAddr },
          })
        let totalStakedLp =
          Number(totalStakedLpResponse) / Math.pow(10, lpDetail.lpDecimals)

      //   // get distribution data
      //   const distributableTokens: DistributableToken[] =
      //     await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {
      //       query_list_of_distributable_tokens_by_pool: { pool: lpDetail.lpAddr },
      //     })
      //   let totalDailyReward = distributableTokens.reduce(
      //     (accumulator, currentValue) => {
      //       let distributableToken =
      //         tokenPrices &&
      //         tokenPrices.find((each) => each.token === currentValue.info)
      //       if (distributableToken === undefined) {
      //         console.error('token price not found', currentValue.info)
      //         return accumulator
      //       }
      //       return (
      //         accumulator +
      //         (Number(distributableToken.unitPrice) *
      //           Number(currentValue.daily_reward)) /
      //           Math.pow(10, Number(distributableToken.decimals))
      //       )
      //     },
      //     0
      //   )

      //   // get treasury fee percent
      //   const treasuryFeePercent: number =
      //     await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {
      //       query_treasury_fee: {},
      //     })

      // const synePrice = Number(token_prices && token_prices.find(each => each.symbol === SYNE)?.unitPrice).toFixed(3)
      //   return (
      //     (((totalDailyReward * 365) / (totalStakedLp * lpPrice)) *
      //       100 *
      //       (1000000 - treasuryFeePercent)) /
      //     1000000
      //   ).toFixed(2)
      return '0.00'
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndUserLpDeposit = (base: string, pair: string) => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, pair, walletAddress, VAULT_USER_DEPOSIT],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.pair === pair)
      if (lpDetail === undefined) return '0'
      const res: WyndUserStakedByDurationResponse =
        await cosmwasmClient.queryContractSmart(WYND_STACKING_ADDR, {
          user_staked_by_duration: {
            address: walletAddress,
            pair_address: pair,
            unbonding_period: UNBONDING_PERIOD,
          },
        })
      return res.staked
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndUserLpClaim = (base: string, pair: string) => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, pair, walletAddress, VAULT_USER_CLAIM],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.pair === pair)
      if (lpDetail === undefined) return '0'
      const res: ClaimsResponse = await cosmwasmClient.queryContractSmart(
        WYND_STACKING_ADDR,
        {
          claims: {
            owner: walletAddress,
            pair_address: pair,
          },
        }
      )
      return res.claims
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndLpTvl = (base: string, pair: string) => {
  const queryClient = useQueryClient()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, pair, TVL],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.pair === pair)
      if (lpDetail === undefined)
        return {
          balance: '0',
          price: '0',
        }
      // get lp token price
      const poolInfo: WyndPoolInfo = await cosmwasmClient.queryContractSmart(
        pair,
        {
          pool: {},
        }
      )
      const tokenPrices: TokenPrice[] | undefined =
        queryClient.getQueryData(TOKEN_PRICES)
      if (tokenPrices === undefined)
        return {
          balance: '0',
          price: '0',
        }
      const poolInfoAsset0 =
        'token' in poolInfo.assets[0].info
          ? poolInfo.assets[0].info.token
          : poolInfo.assets[0].info.native
      const poolInfoAsset1 =
        'token' in poolInfo.assets[1].info
          ? poolInfo.assets[1].info.token
          : poolInfo.assets[1].info.native
      const token0Price = Number(
        tokenPrices &&
          tokenPrices.find((each) => {
            return each.token === poolInfoAsset0
          })?.unitPrice
      )
      const token1Price = Number(
        tokenPrices &&
          tokenPrices.find((each) => {
            return each.token === poolInfoAsset1
          })?.unitPrice
      )
      let checkOrder = true
      let asset0Addr =
        'addr' in lpDetail.asset0 ? lpDetail.asset0.addr : lpDetail.asset0.denom
      let asset1Addr =
        'addr' in lpDetail.asset1 ? lpDetail.asset1.addr : lpDetail.asset1.denom
      if (asset0Addr === poolInfoAsset0 && asset1Addr === poolInfoAsset1)
        checkOrder = true
      else if (asset0Addr === poolInfoAsset1 && asset1Addr === poolInfoAsset0)
        checkOrder = false
      else {
        console.error('Invalid LP tokens', poolInfo, lpDetail)
        return {
          balance: '0',
          price: '0',
        }
      }
      let lpPrice = 0
      if (checkOrder === true) {
        lpPrice =
          ((Number(poolInfo.assets[0].amount) /
            Math.pow(10, lpDetail.asset0.decimals)) *
            token0Price +
            (Number(poolInfo.assets[1].amount) /
              Math.pow(10, lpDetail.asset1.decimals)) *
              token1Price) /
          (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
      } else {
        lpPrice =
          ((Number(poolInfo.assets[0].amount) /
            Math.pow(10, lpDetail.asset1.decimals)) *
            token0Price +
            (Number(poolInfo.assets[1].amount) /
              Math.pow(10, lpDetail.asset0.decimals)) *
              token1Price) /
          (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
      }
      // get total staked lp
      let totalStakedLpResponse: WyndTotalStakedByPairResponse =
        await cosmwasmClient.queryContractSmart(WYND_STACKING_ADDR, {
          total_staked_by_pair: { pair_address: pair },
        })
      let totalStakedLp = new bigDecimal(totalStakedLpResponse.staked)
        .add(new bigDecimal(totalStakedLpResponse.unbonding))
        .getValue()

      return {
        balance: totalStakedLp,
        price: lpPrice.toString(),
      }
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndUserLpReward = (base: string, pair: string) => {
  const { address: walletAddress } = useWallet()
  const queryClient = useQueryClient()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, pair, walletAddress, VAULT_USER_REWARD],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.pair === pair)
      const tokenPrices: TokenPrice[] | undefined =
        queryClient.getQueryData(TOKEN_PRICES)
      if (!lpDetail || !tokenPrices) return []
      // get user reward
      const userRewardResponse: WyndUserRewardInfoResponse[] =
        await cosmwasmClient.queryContractSmart(WYND_STACKING_ADDR, {
          user_reward_info: {
            owner: walletAddress,
            pair_address: pair,
          },
        })
      let userRewards: UserReward[] = []
      for (let userReward of userRewardResponse) {
        let tokenPriceData = tokenPrices.find(
          (each) => each.token === Object.values(userReward.asset_info)[0]
        )
        let rewardDecimals = tokenPriceData?.decimals || 0
        let reward =
          Number(userReward.pending_rewards) /
          Math.pow(10, Number(rewardDecimals))
        userRewards.push({
          token: Object.values(userReward.asset_info)[0],
          name: tokenPriceData?.name || '',
          symbol: tokenPriceData?.symbol || '',
          decimals: tokenPriceData?.decimals || '0',
          price: tokenPriceData?.unitPrice || '0',
          rewardPerSecond: '0',
          reward: reward.toFixed(6),
        })
      }
      return userRewards
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

const useFetchWyndUserLpBalance = (base: string, lpAddr: string) => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [LP_POOLS, base, lpAddr, walletAddress, TOKEN_BALANCE],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      const lpDetail = wyndLpPools.find((each) => each.lpAddr === lpAddr)
      if (!lpDetail) return '0'
      // get user balance
      const userBalance: TokenBalanceResponse | undefined =
        await cosmwasmClient.queryContractSmart(lpAddr, {
          balance: { address: walletAddress },
        })
      return new bigDecimal(userBalance?.balance || '0')
        .divide(
          new bigDecimal(Math.pow(10, lpDetail.lpDecimals).toString()),
          lpDetail.lpDecimals
        )
        .getValue()
    },
    enabled: !!walletAddress,
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}
