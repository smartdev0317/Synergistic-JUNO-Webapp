import { useQuery } from "react-query"
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import bigDecimal from "js-big-decimal"
import { useWallet } from "@noahsaso/cosmodal"

import { autoCompoundPools } from "constants/autoCompoundPools"
import { APR, AUTO_COMPOUND_POOLS, BLOOP, BTOKEN_BALANCE, LOOP, TOKEN_BALANCE, VAULT_TOTAL_STAKE, VAULT_USER_DEPOSIT, VAULT_USER_REWARD, WYND } from "constants/keyNames"
import { PUBLIC_RPC_ENDPOINT } from "constants/setting";
import { AllStakedResponse, BondingInfoResponse, LoopStakingConfigResponse, LoopStakingTotalBalanceResponse } from "data/types"

export const useFetchLiquidStakingPools = () => {
    autoCompoundPools.map((each, index) => {
        useFetchVaultApr(index)
        useFetchVaultTotalStake(index)
        useFetchVaultUserDeposit(index)
        useFetchVaultUserReward(index)
        useFetchVaultTokenBalance(index)
        useFetchVaultBTokenBalance(index)
    })
}

const useFetchVaultApr = (index: number) => {
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, APR],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            if (autoCompoundPool.name === BLOOP) {
                let res_total_daily_reward: string = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"query_total_daily_reward":{}})
                let total_daily_reward = new bigDecimal(res_total_daily_reward)
                let res_config: LoopStakingConfigResponse = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"query_config":{}})
                let total_balance = new bigDecimal("0")
                let last_duration = res_config.duration_values_vector[0]
                for (let duration of res_config.duration_values_vector) {
                    let total_balance_by_duration_response: LoopStakingTotalBalanceResponse = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"total_balance": {duration}})
                    total_balance = total_balance.add(new bigDecimal(total_balance_by_duration_response.balance))
                    last_duration = duration
                }
                let apr = total_daily_reward.multiply(new bigDecimal(365)).divide(total_balance, 6).multiply(new bigDecimal(80)).multiply(new bigDecimal(last_duration))
                const res_total_staked = await cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"total_stake":{}})
                let total_staked = res_total_staked.total_staked
                if (total_staked === "0") return apr.getValue()
                let total_staked_by_staker = new bigDecimal("0")
                for (let duration of res_config.duration_values_vector) {
                    const res_staked_staker = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"query_staked_by_user":{"wallet":autoCompoundPool.converterAndStaker,"duration":duration}})
                    total_staked_by_staker = total_staked_by_staker.add(new bigDecimal(res_staked_staker))
                }
                return apr.multiply(total_staked_by_staker).divide(new bigDecimal(total_staked), 6).getValue()
            } else {
                const res_bonding_info: BondingInfoResponse = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"bonding_info":{}})
                let total_rewards_shares = new bigDecimal(0)
                for (let i = 0; i < res_bonding_info.bonding.length; i++) {
                    let bonding_info = res_bonding_info.bonding[i]
                    let reward_multiplier = new bigDecimal(bonding_info.reward_multiplier)
                    let total_staked = new bigDecimal(bonding_info.total_staked)
                    total_rewards_shares = total_rewards_shares.add(total_staked.multiply(reward_multiplier))
                }
                let max_reward_multiplier = new bigDecimal(res_bonding_info.bonding[res_bonding_info.bonding.length - 1].reward_multiplier)
                let division = new bigDecimal(Math.pow(10, autoCompoundPool.token.decimals))
                let apr = new bigDecimal(365 * 30000).multiply(max_reward_multiplier).divide(total_rewards_shares.divide(division, 6), 6).multiply(new bigDecimal(0.8)).multiply(new bigDecimal(100))
                const res_total_staked = await cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"total_stake": {}})
                let total_staked = res_total_staked.total_staked
                if (total_staked === "0") return apr.getValue()
                const res_staked_staker: AllStakedResponse = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"all_staked": {"address": autoCompoundPool.converterAndStaker}})
                let staked_staker = new bigDecimal(0)
                for (let i = 0; i < res_staked_staker.stakes.length; i++) {
                    let staking = res_staked_staker.stakes[i]
                    if (staking.cw20_contract !== autoCompoundPool.token.address) continue
                    for (let j = 0; j < res_bonding_info.bonding.length; j++) {
                        let bonding_info = res_bonding_info.bonding[j]
                        if (staking.unbonding_period !== bonding_info.unbonding_period) continue
                        let staked_amount = new bigDecimal(staking.stake)
                        let reward_multiplier = new bigDecimal(bonding_info.reward_multiplier)
                        staked_staker = staked_staker.add(staked_amount.multiply(reward_multiplier).divide(max_reward_multiplier, 6))
                    }
                }
                return apr.multiply(staked_staker).divide(new bigDecimal(total_staked), 6).getValue()
            }
        }
    })
    return {
        data, error
    }
}

const useFetchVaultTotalStake = (index: number) => {
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, VAULT_TOTAL_STAKE],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            const res = await cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"total_stake":{}})
            return res.total_staked || "0"
        },
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchVaultUserDeposit = (index: number) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, VAULT_USER_DEPOSIT],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            const res = await cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"stake":{"address": walletAddress}})
            return res.stake || "0"
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchVaultUserReward = (index: number) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, VAULT_USER_REWARD],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            if (autoCompoundPool.token.symbol === LOOP) {
                const config = await cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"query_config":{}})
                const queries = [cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"reward":{"address": walletAddress}})]
                queries.push(cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"query_total_daily_reward":{}}))
                queries.push(cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"balance":{"address": autoCompoundPool.converterAndStaker}}))
                for (let i=0; i<config.duration_values_vector.length; i++) {
                    queries.push(cosmwasmClient.queryContractSmart(autoCompoundPool.vault, {"total_balance":{"duration":config.duration_values_vector[i]}}))
                }
                const res = await Promise.all(queries)
                let total_balance = "0"
                for (let i=3; i<res.length; i++) {
                    total_balance = new bigDecimal(total_balance).add(new bigDecimal(res[i].balance)).getValue()
                }
                return {
                    pending_reward: res[0].rewards,
                    total_daily_reward: res[1],
                    total_balance,
                    vault_balance: res[2].balance,
                    distribution_wait_time: config.wait_time_for_distribution_in_seconds,
                    last_distribution: config.last_distributed,
                    auto_increase: true
                }
            }
            if (autoCompoundPool.token.symbol === WYND) {
                const pending_reward = await cosmwasmClient.queryContractSmart(autoCompoundPool.bvault, {"reward":{"address": walletAddress}})
                return {
                    pending_reward: pending_reward.rewards,
                    auto_increase: false
                }
            }
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchVaultTokenBalance = (index: number) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, TOKEN_BALANCE],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            const res = await cosmwasmClient.queryContractSmart(autoCompoundPool.token.address, {"balance":{"address": walletAddress}})
            return new bigDecimal(res.balance).getValue() || "0"
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}

const useFetchVaultBTokenBalance = (index: number) => {
    const {address: walletAddress} = useWallet()
    const {data, error} = useQuery({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
        queryFn: async () => {
            let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
            let autoCompoundPool = autoCompoundPools[index]
            const res = await cosmwasmClient.queryContractSmart(autoCompoundPool.btoken.address, {"balance":{"address": walletAddress}})
            return new bigDecimal(res.balance).getValue() || "0"
        },
        enabled: !!walletAddress,
        refetchInterval: 300000
    })
    return {
        data, error
    }
}
