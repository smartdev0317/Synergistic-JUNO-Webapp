import { useWallet } from '@noahsaso/cosmodal'
import { useMutation, useQueryClient } from 'react-query'

import { LOOP_STACKING_ADDR, WYND_STACKING_ADDR } from 'constants/address'
import {
  APR,
  LOOP,
  TOKEN_BALANCE,
  TVL,
  VAULT_USER_CLAIM,
  VAULT_USER_DEPOSIT,
  VAULT_USER_REWARD,
  WYND,
} from 'constants/keyNames'
import { LOOP_FARM_STAKEABLE_INFO } from 'constants/lpPools'
import { UNBONDING_PERIOD } from 'constants/wyndGauge'

export const useDepositLpToken = (
  type: string,
  base: string,
  pair: string,
  lpToken: string
) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (amount: string) => {
      if (base === LOOP) {
        const index = LOOP_FARM_STAKEABLE_INFO.findIndex(
          (each) => each.token === lpToken
        )
        let start_after = null
        if (index > 1) start_after = LOOP_FARM_STAKEABLE_INFO[index - 1].token
        let msg
        if (start_after === null) {
          msg = {
            send: {
              contract: LOOP_STACKING_ADDR,
              amount: amount,
              msg: btoa(`{"stake":{"start_after":null}}`),
            },
          }
        } else {
          msg = {
            send: {
              contract: LOOP_STACKING_ADDR,
              amount: amount,
              msg: btoa(`{"stake":{"start_after":"${start_after}"}}`),
            },
          }
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            lpToken,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      } else if (base === WYND) {
        const msg = {
          send: {
            contract: WYND_STACKING_ADDR,
            amount: amount,
            msg: btoa(`{"delegate":{"unbonding_period":${UNBONDING_PERIOD}}}`),
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            lpToken,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [type, base, lpToken, APR] })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_DEPOSIT],
      })
      queryClient.invalidateQueries({ queryKey: [type, base, pair, TVL] })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_REWARD],
      })
      queryClient.invalidateQueries({
        queryKey: [type, base, lpToken, walletAddress, TOKEN_BALANCE],
      })
    },
  })
  return mutation
}

export const useWithdrawLpToken = (
  type: string,
  base: string,
  pair: string,
  lpToken: string
) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (amount: string) => {
      if (base === LOOP) {
        const index = LOOP_FARM_STAKEABLE_INFO.findIndex(
          (each) => each.token === lpToken
        )
        let start_after = null
        if (index > 1) start_after = LOOP_FARM_STAKEABLE_INFO[index - 1].token
        const msg = {
          unstake_and_claim: {
            pool_address: lpToken,
            amount: amount,
            start_after: start_after,
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            LOOP_STACKING_ADDR,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      } else if (base === WYND) {
        const msg = {
          claim: {
            pool_address: pair,
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            WYND_STACKING_ADDR,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [type, base, lpToken, APR] })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_DEPOSIT],
      })
      if (type === WYND) {
        queryClient.invalidateQueries({
          queryKey: [type, base, pair, walletAddress, VAULT_USER_CLAIM],
        })
      }
      queryClient.invalidateQueries({ queryKey: [type, base, pair, TVL] })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_REWARD],
      })
      queryClient.invalidateQueries({
        queryKey: [type, base, lpToken, walletAddress, TOKEN_BALANCE],
      })
    },
  })
  return mutation
}

export const useUnbondLpToken = (
  type: string,
  base: string,
  pair: string,
  lpToken: string
) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (amount: string) => {
      if (base === WYND) {
        const msg = {
          unbond: {
            pool_address: pair,
            amount: amount,
            unbonding_period: UNBONDING_PERIOD,
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            WYND_STACKING_ADDR,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [type, base, lpToken, APR] })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_DEPOSIT],
      })
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_CLAIM],
      })
    },
  })
  return mutation
}

export const useClaimLpToken = (
  type: string,
  base: string,
  pair: string,
  lpToken: string
) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (base === LOOP) {
        const index = LOOP_FARM_STAKEABLE_INFO.findIndex(
          (each) => each.token === lpToken
        )
        let start_after = null
        if (index > 1) start_after = LOOP_FARM_STAKEABLE_INFO[index - 1].token
        const msg = {
          claim_reward: {
            start_after: start_after,
            pool_address: lpToken,
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            LOOP_STACKING_ADDR,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      } else if (base === WYND) {
        const msg = {
          claim: {
            pair_address: pair,
          },
        }
        if (walletAddress) {
          return await signingCosmWasmClient?.execute(
            walletAddress,
            WYND_STACKING_ADDR,
            msg,
            'auto'
          )
        } else {
          throw new Error('Please connect wallet')
        }
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [type, base, pair, walletAddress, VAULT_USER_REWARD],
      })
    },
  })
  return mutation
}
