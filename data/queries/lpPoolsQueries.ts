import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Block } from "@cosmjs/stargate"
import { useWallet } from "@noahsaso/cosmodal"
import bigDecimal from "js-big-decimal"
import { useQuery, useQueryClient } from "react-query"

import { LOOP_PROTOCOL_FARMING_CONTRACT, LOOP_STACKING_ADDR } from "constants/address"
import { APR, LOOP, LP_POOLS, TOKEN_BALANCE, TOKEN_PRICES, TVL, VAULT_USER_DEPOSIT, VAULT_USER_REWARD, WYND } from "constants/keyNames"
import { loopLpPools } from "constants/lpPools"
import { PUBLIC_RPC_ENDPOINT } from "constants/setting"
import { DistributableToken, LoopLpFarmDataType, PoolInfo, TokenBalanceResponse, TokenPrice, UserReward, UserRewardInfo } from "data/types"

export const useFetchLpPool = (pool: LoopLpFarmDataType) => {
    useFetchLpPoolApr(pool.base, pool.pair)
    useFetchUserLpDeposit(pool.base, pool.pair)
    useFetchLpTvl(pool.base, pool.pair)
    useFetchUserLpReward(pool.base, pool.pair)
    useFetchUserLpBalance(pool.base, pool.lpAddr)
}

const useFetchLpPoolApr = (base: string, pair: string) => {
    const queryClient = useQueryClient()
    const {data, error} = useQuery({
        queryKey: [LP_POOLS, base, pair, APR],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            const lpDetail = loopLpPools.find(each => each.pair === pair)
            if (lpDetail === undefined) return "0"
            // get lp token price
            const poolInfo: PoolInfo = await cosmwasmClient.queryContractSmart(pair, {"pool":{}})
            const tokenPrices: TokenPrice[] | undefined = queryClient.getQueryData(TOKEN_PRICES)
            if (tokenPrices === undefined) return "0"
            const poolInfoAsset0 = "token" in poolInfo.assets[0].info ? poolInfo.assets[0].info.token.contract_addr : poolInfo.assets[0].info.native_token.denom
            const poolInfoAsset1 = "token" in poolInfo.assets[1].info ? poolInfo.assets[1].info.token.contract_addr : poolInfo.assets[1].info.native_token.denom
            const token0Price = Number(tokenPrices && tokenPrices.find(each => {
                return each.token === poolInfoAsset0
            })?.unitPrice)
            const token1Price = Number(tokenPrices && tokenPrices.find(each => {
                return each.token === poolInfoAsset1
            })?.unitPrice)
            let checkOrder = true
            let asset0Addr = "addr" in lpDetail.asset0 ? lpDetail.asset0.addr : lpDetail.asset0.denom
            let asset1Addr = "addr" in lpDetail.asset1 ? lpDetail.asset1.addr : lpDetail.asset1.denom
            if (asset0Addr === poolInfoAsset0 && asset1Addr === poolInfoAsset1) checkOrder = true
            else if (asset0Addr === poolInfoAsset1 && asset1Addr === poolInfoAsset0) checkOrder = false
            else {
                console.error("Invalid LP tokens", poolInfo, lpDetail)
                return "0"
            }
            let lpPrice = 0
            if (checkOrder === true) {
                lpPrice = ((Number(poolInfo.assets[0].amount) / Math.pow(10, lpDetail.asset0.decimals) * token0Price) + (Number(poolInfo.assets[1].amount) / Math.pow(10, lpDetail.asset1.decimals) * token1Price)) / (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
            } else {
                lpPrice = ((Number(poolInfo.assets[0].amount) / Math.pow(10, lpDetail.asset1.decimals) * token0Price) + (Number(poolInfo.assets[1].amount) / Math.pow(10, lpDetail.asset0.decimals) * token1Price)) / (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
            }
            // get total staked lp
            let totalStakedLpResponse: String = await cosmwasmClient.queryContractSmart(LOOP_PROTOCOL_FARMING_CONTRACT, {"query_total_staked":{"staked_token":lpDetail.lpAddr}})
            let totalStakedLp = Number(totalStakedLpResponse) / Math.pow(10, lpDetail.lpDecimals)

            // get distribution data
            const distributableTokens: DistributableToken[] = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_list_of_distributable_tokens_by_pool":{"pool":lpDetail.lpAddr}})
            let totalDailyReward = distributableTokens.reduce(
                (accumulator, currentValue) => {
                    let distributableToken = tokenPrices && tokenPrices.find(each => each.token === currentValue.info)
                    if (distributableToken === undefined) {
                        console.error("token price not found", currentValue.info)
                        return accumulator
                    }
                    return accumulator + Number(distributableToken.unitPrice) * Number(currentValue.daily_reward) / Math.pow(10, Number(distributableToken.decimals))
                },
                0
            )
            
            // get treasury fee percent
            const treasuryFeePercent: number = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_treasury_fee":{}})

            // const synePrice = Number(token_prices && token_prices.find(each => each.symbol === SYNE)?.unitPrice).toFixed(3)
            return (totalDailyReward * 365 / (totalStakedLp * lpPrice) * 100 * (1000000 - treasuryFeePercent) / 1000000).toFixed(2)
        },
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchUserLpDeposit = (base: string, pair: string) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [LP_POOLS, base, pair, walletAddress, VAULT_USER_DEPOSIT],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            const lpDetail = loopLpPools.find(each => each.pair === pair)
            if (lpDetail === undefined) return "0"
            if (base === LOOP) {
                const res: string = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_staked_by_user": {"wallet":walletAddress, "staked_token": lpDetail.lpAddr}})
                return res
            } else if (base === WYND) {
                return "0"
            }
            return "0"
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchLpTvl = (base: string, pair: string) => {
    const queryClient = useQueryClient()
    const {data, error} = useQuery({
        queryKey: [LP_POOLS, base, pair, TVL],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            const lpDetail = loopLpPools.find(each => each.pair === pair)
            if (lpDetail === undefined) return {
                balance: "0",
                price: "0"
            }
            // get lp token price
            const poolInfo: PoolInfo = await cosmwasmClient.queryContractSmart(pair, {"pool":{}})
            const tokenPrices: TokenPrice[] | undefined = queryClient.getQueryData(TOKEN_PRICES)
            if (tokenPrices === undefined) return {
                balance: "0",
                price: "0"
            }
            const poolInfoAsset0 = "token" in poolInfo.assets[0].info ? poolInfo.assets[0].info.token.contract_addr : poolInfo.assets[0].info.native_token.denom
            const poolInfoAsset1 = "token" in poolInfo.assets[1].info ? poolInfo.assets[1].info.token.contract_addr : poolInfo.assets[1].info.native_token.denom
            const token0Price = Number(tokenPrices && tokenPrices.find(each => {
                return each.token === poolInfoAsset0
            })?.unitPrice)
            const token1Price = Number(tokenPrices && tokenPrices.find(each => {
                return each.token === poolInfoAsset1
            })?.unitPrice)
            let checkOrder = true
            let asset0Addr = "addr" in lpDetail.asset0 ? lpDetail.asset0.addr : lpDetail.asset0.denom
            let asset1Addr = "addr" in lpDetail.asset1 ? lpDetail.asset1.addr : lpDetail.asset1.denom
            if (asset0Addr === poolInfoAsset0 && asset1Addr === poolInfoAsset1) checkOrder = true
            else if (asset0Addr === poolInfoAsset1 && asset1Addr === poolInfoAsset0) checkOrder = false
            else {
                console.error("Invalid LP tokens", poolInfo, lpDetail)
                return {
                    balance: "0",
                    price: "0"
                }
            }
            let lpPrice = 0
            if (checkOrder === true) {
                lpPrice = ((Number(poolInfo.assets[0].amount) / Math.pow(10, lpDetail.asset0.decimals) * token0Price) + (Number(poolInfo.assets[1].amount) / Math.pow(10, lpDetail.asset1.decimals) * token1Price)) / (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
            } else {
                lpPrice = ((Number(poolInfo.assets[0].amount) / Math.pow(10, lpDetail.asset1.decimals) * token0Price) + (Number(poolInfo.assets[1].amount) / Math.pow(10, lpDetail.asset0.decimals) * token1Price)) / (Number(poolInfo.total_share) / Math.pow(10, lpDetail.lpDecimals))
            }
            // get total staked lp
            let totalStakedLpResponse: String = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_total_staked":{"staked_token":lpDetail.lpAddr}})
            let totalStakedLp = totalStakedLpResponse

            return {
                balance: totalStakedLp,
                price: lpPrice.toString()
            }
        },
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchUserLpReward = (base: string, pair: string) => {
    const {address: walletAddress} = useWallet()
    const queryClient = useQueryClient()
    const {data, error} = useQuery({
        queryKey: [LP_POOLS, base, pair, walletAddress, VAULT_USER_REWARD],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            const lpDetail = loopLpPools.find(each => each.pair === pair)
            const tokenPrices: TokenPrice[] | undefined = queryClient.getQueryData(TOKEN_PRICES)
            if (!lpDetail || !tokenPrices) return []
            // get user reward
            const userStaked: string = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_staked_by_user": {"wallet":walletAddress, "staked_token": lpDetail.lpAddr}}) || "0"
            const totalStaked: string = await cosmwasmClient.queryContractSmart(LOOP_PROTOCOL_FARMING_CONTRACT, {"query_total_staked":{"staked_token":lpDetail.lpAddr}}) || "0"
            let userRewardResponse: UserRewardInfo[] | undefined = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_user_reward_in_pool":{"wallet":walletAddress, "pool":lpDetail.lpAddr}})
            const distributableTokens: DistributableToken[] = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_list_of_distributable_tokens_by_pool":{"pool":lpDetail.lpAddr}})
            if (!userRewardResponse || !distributableTokens) return []
            let userStakedTime: string = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_user_staked_time":{"wallet":walletAddress, "pool":lpDetail.lpAddr}}) || Date.now().toString()
            let lastDistributionTime: number = await cosmwasmClient.queryContractSmart(LOOP_STACKING_ADDR, {"query_last_distribution_time":{"pool_address":lpDetail.lpAddr}}) || Date.now()
            let blockInfo: Block = await cosmwasmClient.getBlock()
            let date = new Date(blockInfo.header.time).getTime()
            let userRewards: UserReward[] = []
            for (let distributableToken of distributableTokens) {
                let rewardPerSecond = Number(distributableToken.daily_reward) * (Number(userStaked) / Number(totalStaked)) / 86400
                let rewardDecimals = tokenPrices.find(each => each.token === distributableToken.info)?.decimals || 0
                let reward = rewardPerSecond * (date / 1000 - Math.max(Number(userStakedTime), lastDistributionTime)) / Math.pow(10, Number(rewardDecimals))
                let index = userRewardResponse[0].rewards_info.findIndex(each => each[0] === distributableToken.info)
                let tokenPriceData = tokenPrices.find(each => each.token === distributableToken.info)
                if (index === -1) {
                    userRewards.push({
                        token: distributableToken.info,
                        name: tokenPriceData?.name || "",
                        symbol: tokenPriceData?.symbol || "",
                        decimals: tokenPriceData?.decimals || "0",
                        price: tokenPriceData?.unitPrice || "0",
                        rewardPerSecond: rewardPerSecond.toString(),
                        reward: reward.toFixed(6)
                    })
                } else {
                    userRewards.push({
                        token: distributableToken.info,
                        name: tokenPriceData?.name || "",
                        symbol: tokenPriceData?.symbol || "",
                        decimals: tokenPriceData?.decimals || "0",
                        price: tokenPriceData?.unitPrice || "0",
                        rewardPerSecond: rewardPerSecond.toString(),
                        reward: (Number(userRewardResponse[0].rewards_info[index][1]) / Math.pow(10, Number(rewardDecimals)) + reward).toFixed(6)
                    })
                }
            }
            return userRewards
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchUserLpBalance = (base: string, lpAddr: string) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [LP_POOLS, base, lpAddr, walletAddress, TOKEN_BALANCE],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            const lpDetail = loopLpPools.find(each => each.lpAddr === lpAddr)
            if (!lpDetail) return "0"
            // get user balance
            const userBalance: TokenBalanceResponse | undefined = await cosmwasmClient.queryContractSmart(lpAddr, {"balance": {"address":walletAddress}})
            return new bigDecimal(userBalance?.balance || "0").divide(new bigDecimal((Math.pow(10, lpDetail.lpDecimals)).toString()), lpDetail.lpDecimals).getValue()
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}
