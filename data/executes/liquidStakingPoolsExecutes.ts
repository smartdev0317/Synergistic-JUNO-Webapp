import { useWallet } from '@noahsaso/cosmodal'
import { useMutation, useQueryClient } from 'react-query'

import {
  APR,
  AUTO_COMPOUND_POOLS,
  BTOKEN_BALANCE,
  TOKEN_BALANCE,
  VAULT_TOTAL_STAKE,
  VAULT_USER_DEPOSIT,
  VAULT_USER_REWARD,
} from 'constants/keyNames'
import {
  ClaimRewardToken,
  ConvertToken,
  StakeToken,
  WithdrawToken,
} from 'data/types'

export const useConvertAutoCompoundPoolToken = (index: number) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: ConvertToken) => {
      const msg = {
        send: {
          contract: data.converter,
          amount: data.amount,
          msg: btoa('{"convert":{}}'),
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          data.token,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, TOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_REWARD,
        ],
      })
    },
  })
  return mutation
}

export const useConvertAndStakeAutoCompoundPoolToken = (index: number) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  interface PropType {
    convert: ConvertToken
    stake: StakeToken
  }

  const mutation = useMutation({
    mutationFn: async ({ convert, stake }: PropType) => {
      const msgs = [
        {
          contractAddress: convert.token,
          funds: [],
          msg: {
            send: {
              contract: convert.converter,
              amount: convert.amount,
              msg: btoa('{"convert":{}}'),
            },
          },
        },
        {
          contractAddress: stake.token,
          funds: [],
          msg: {
            send: {
              contract: stake.vault,
              amount: stake.amount,
              msg: btoa('{"stake":{}}'),
            },
          },
        },
      ]
      if (walletAddress) {
        return await signingCosmWasmClient?.executeMultiple(
          walletAddress,
          msgs,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, TOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, VAULT_TOTAL_STAKE],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_DEPOSIT,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, APR],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_REWARD,
        ],
      })
    },
  })
  return mutation
}

export const useDepositAutoCompoundPoolToken = (index: number) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: StakeToken) => {
      const msg = {
        send: {
          contract: data.vault,
          amount: data.amount,
          msg: btoa('{"stake":{}}'),
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          data.token,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, VAULT_TOTAL_STAKE],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_DEPOSIT,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, APR],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_REWARD,
        ],
      })
    },
  })
  return mutation
}

export const useWithdrawAutoCompoundPoolToken = (index: number) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: WithdrawToken) => {
      const msg = {
        unstake: {
          amount: data.amount,
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          data.vault,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, VAULT_TOTAL_STAKE],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_DEPOSIT,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_REWARD,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, APR],
      })
    },
  })
  return mutation
}

export const useClaimRewardAutoCompoundPoolToken = (index: number) => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: ClaimRewardToken) => {
      const msg = {
        withdraw_rewards: {
          address: walletAddress,
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          data.vault,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({
        queryKey: [
          AUTO_COMPOUND_POOLS,
          index,
          walletAddress,
          VAULT_USER_REWARD,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [AUTO_COMPOUND_POOLS, index, walletAddress, BTOKEN_BALANCE],
      })
    },
  })
  return mutation
}
